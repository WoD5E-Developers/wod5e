import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import _import from 'eslint-plugin-import'
import { fixupPluginRules } from '@eslint/compat'

export default defineConfig([
  // Ignore build and dependency folders
  {
    ignores: ['node_modules/**', 'lib/**']
  },

  // JavaScript linting
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module'
    },
    plugins: {
      import: fixupPluginRules(_import),
      prettier: fixupPluginRules(prettier)
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-extra-semi': 'error',
      indent: ['error', 2],
      'prettier/prettier': [
        'error',
        {
          semi: false,
          tabWidth: 2,
          useTabs: false
        }
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always'
        }
      ],
      env: {
        browser: true,
        node: true
      }
    }
  }
])
