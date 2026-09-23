import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import Handlebars from 'handlebars'

const root = fileURLToPath(new URL('../', import.meta.url))

// Grab all the Handlebar template files that need linting
async function findTemplates(directory) {
  const entries = await readdir(directory, { withFileTypes: true })

  const files = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) return findTemplates(filename)
      return /\.(hbs|handlebars)$/.test(entry.name) ? [filename] : []
    })
  )

  return files.flat().sort()
}

// Actually do the linting in this function
// This basically runs through a handful of rules
// We don't use Glimmer or anything like that because Foundry uses custom things
// that Glimmer doesn't play nice with
export function lintTemplate(source, knownPartials) {
  const errors = []

  const report = (node, message) => {
    errors.push({ line: node.loc.start.line, column: node.loc.start.column + 1, message })
  }

  let ast

  try {
    ast = Handlebars.parse(source)
    Handlebars.precompile(ast)
  } catch (error) {
    const location = error.hash?.loc
    return [
      {
        line: location?.first_line ?? error.lineNumber ?? 1,
        column: (location?.first_column ?? error.column ?? 0) + 1,
        message: error.message
      }
    ]
  }

  const visit = (node) => {
    if (!node || typeof node !== 'object') return

    // Duplicate helpers
    if (node.type === 'Hash') {
      const keys = new Set()
      for (const pair of node.pairs) {
        if (keys.has(pair.key)) report(pair, `Duplicate helper argument "${pair.key}"`)
        keys.add(pair.key)
      }
    }

    // Catch potentially unknown partials
    if (node.type === 'PartialStatement' || node.type === 'PartialBlockStatement') {
      const name = node.name.value ?? node.name.original

      if (name?.startsWith('systems/wod5e/') && !knownPartials.has(name)) {
        report(node, `Unknown system partial "${name}"`)
      }
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc') continue
      if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === 'object') visit(value)
    }
  }

  visit(ast)
  return errors
}

async function main() {
  const files = await findTemplates(path.join(root, 'display'))
  if (!files.length) throw new Error('No Handlebars templates found in display/')
  const knownPartials = new Set(
    files.map((file) => `systems/wod5e/${path.relative(root, file).split(path.sep).join('/')}`)
  )

  let errorCount = 0
  for (const file of files) {
    const errors = lintTemplate(await readFile(file, 'utf8'), knownPartials)

    for (const error of errors) {
      console.error(`${path.relative(root, file)}:${error.line}:${error.column} ${error.message}`)
    }

    errorCount += errors.length
  }

  console.log(`Checked ${files.length} Handlebars templates; ${errorCount} errors.`)
  if (errorCount) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
