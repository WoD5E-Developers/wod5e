import { execSync } from 'node:child_process'

// Change this if we want to be more frequent about code review
const since = '1 year ago'

// This filters out a lot of files that aren't important to know that they're always changing
// For example, system.json will change every release - and so will wod5e-styling.css
const ignoredPrefixes = [
  'lang/',
  'packs/',
  'system.json',
  'package.json',
  'display/wod5e-styling.css'
]

// Get a log of all file changes in git for the given time period
const output = execSync(`git log --since="${since}" --name-only --pretty=format:`, {
  encoding: 'utf8'
})

// Map the output to something we can put into a table
const counts = new Map()
for (const file of output.split(/\r?\n/)) {
  const trimmed = file.trim()
  if (!trimmed) continue
  if (ignoredPrefixes.some((prefix) => trimmed.startsWith(prefix))) continue

  counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1)
}
const topFiles = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)

// Recently learned console.table exists - where has this been all my life..?
// Anyway this is just so that it looks pretty for whatever developer is
// reviewing the past year of changes
console.table(
  topFiles.map(([file, count]) => ({
    Count: count,
    File: file
  }))
)
