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
      sourceType: 'module',
      globals: {
        // Browser and Node globals
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        Event: 'readonly',
        HTMLElement: 'readonly',
        setTimeout: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',

        // Foundry globals
        CONST: 'readonly',
        CONFIG: 'readonly',
        foundry: 'readonly',
        game: 'readonly',
        ui: 'readonly',
        ChatMessage: 'readonly',
        Hooks: 'readonly',
        Handlebars: 'readonly',
        fromUuidSync: 'readonly',
        getDocumentClass: 'readonly',
        Macro: 'readonly',
        $: 'readonly',
        FormApplication: 'readonly',
        canvas: 'readonly',
        Actor: 'readonly',
        Item: 'readonly',
        FormData: 'readonly',

        // System globals
        WOD5E: 'readonly',
        jscolor: 'readonly',
        JSColor: 'readonly',
        SortingHelpers: 'readonly'
      }
    },
    plugins: {
      import: fixupPluginRules(_import),
      prettier: fixupPluginRules(prettier)
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-extra-semi': 'error',
      indent: 'off',
      'prettier/prettier': [
        'error',
        {
          semi: false,
          tabWidth: 2,
          useTabs: false
        }
      ],
      'import/extensions': ['error', 'always', { ignorePackages: true }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always'
        }
      ]
    }
  }
])
