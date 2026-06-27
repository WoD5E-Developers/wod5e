import fs from 'fs'
import path from 'path'

import archiver from 'archiver'

// Output file
const outputFile = 'wod5e.zip'

// Delete the old outputFile if it already exists
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile)
  console.log(`Deleted old ${outputFile} file, generating new release file...`)
}

// All important files to the system
const files = ['LICENSE.md', 'README.md', 'system.json']

// All important directories to the system
const directories = ['assets', 'display', 'lang', 'lib', 'macros', 'packs', 'system']

const output = fs.createWriteStream(outputFile)
const archive = archiver('zip', {
  zlib: {
    level: 9
  }
})

output.on('close', () => {
  console.log(`WOD5E system release file ${outputFile} generated.`)
})

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn(err.message)
  } else {
    throw err
  }
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

// Add files
for (const file of files) {
  if (fs.existsSync(file)) {
    archive.file(file, {
      name: path.basename(file)
    })
  } else {
    console.warn(`Required file wasn't found: ${file}`)
  }
}

// Add directories
for (const dir of directories) {
  if (fs.existsSync(dir)) {
    archive.directory(dir, dir)
  } else {
    console.warn(`Required directory wasn't found: ${dir}`)
  }
}

archive.finalize()
