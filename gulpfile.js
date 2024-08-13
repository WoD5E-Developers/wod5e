const gulp = require('gulp')
const path = require('path')
const fs = require('fs')
const less = require('gulp-less')
const concat = require('gulp-concat')

// Define languages and files here
const languages = ['template'] // Add more languages as needed
const files = ['core', 'vampire', 'werewolf', 'hunter']

// Ensure localization keys exist
gulp.task('localize', function (done) {
  const enDir = path.join(__dirname, 'lang', 'en')

  // Loop through each language
  languages.forEach((lang) => {
    const langDir = path.join(__dirname, 'lang', lang)
    ensureDirectoryExistence(langDir)

    // Loop through each file (core, vampire, etc.)
    files.forEach((file) => {
      const enFilePath = path.join(enDir, `${file}-en.json`)
      const langFilePath = path.join(langDir, `${file}-${lang}.json`)

      const enKeys = readJsonFile(enFilePath)
      let langKeys = readJsonFile(langFilePath)

      if (checkLocalizationKeys(enKeys, langKeys)) {
        writeJsonFile(langFilePath, langKeys)
      }
    })
  })

  done()
})

// Create a task to take all .less files and convert them into CSS for Foundry
// This includes a pipeline to turn it all into a single file so that hotreload works better
gulp.task('less', function () {
  return gulp.src('./display/**/styling/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(concat('wod5e-styling.css')) // Concatenate all CSS files into a single file
    .pipe(gulp.dest('./display/')) // Output for the wod-styling.css file
})

// Watch tasks
gulp.task('watch', function () {
  // Watch all less files for updates to CSS
  gulp.watch('./display/**/styling/**/*.less', gulp.series('less'))

  // Watch English JSON files
  gulp.watch('./lang/en/*.json', gulp.series('localize'))
})

// Default task
gulp.task('default', gulp.series('less', 'localize', 'watch'))

// Create directory if it doesn't exist
function ensureDirectoryExistence (dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
}

// Read JSON file
function readJsonFile (filePath) {
  // Check if the file exists, and use its value if so
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } else {
    // Return a blank object
    return {}
  }
}

// Write JSON data to file
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// Recursively check and update nested keys
function checkLocalizationKeys (enKeys, langKeys) {
  let updated = false

  // Add missing keys from English to the target language
  for (const key in enKeys) {
    if (typeof enKeys[key] === 'object' && enKeys[key] !== null) {
      // If the key is a nested object, recurse into it
      langKeys[key] = langKeys[key] || {}
      if (checkLocalizationKeys(enKeys[key], langKeys[key])) {
        updated = true
      }
    } else {
      // If the key is not present, add it with an underscore and an empty string
      if (!Object.prototype.hasOwnProperty.call(langKeys, key)) {
        langKeys[`_${key}`] = ""
        updated = true
      }
    }
  }

  // Remove keys not present in English from the target language
  for (const key in langKeys) {
    const normalizedKey = key.startsWith('_') ? key.slice(1) : key
    if (!Object.prototype.hasOwnProperty.call(enKeys, normalizedKey)) {
      delete langKeys[key]
      updated = true
    } else if (typeof langKeys[key] === 'object' && langKeys[key] !== null) {
      if (checkLocalizationKeys(enKeys[normalizedKey], langKeys[key])) {
        updated = true
      }
    }
  }

  return updated
}
