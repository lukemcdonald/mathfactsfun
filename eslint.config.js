import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  {
    ignores: ['build/**', '!**/.server', '!**/.client'],
  },
  ...compat.extends('eslint:recommended', 'prettier'),
  {
    plugins: {
      perfectionist,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'import/order': 'off',

      'perfectionist/sort-objects': [
        'warn',
        {
          partitionByComment: true,
          partitionByNewLine: true,
          type: 'natural',
        },
      ],

      'perfectionist/sort-imports': [
        'warn',
        {
          customGroups: {
            value: {
              internal: ['^#app/.*'],
              react: ['^react$', '^react-.+', '^prop-types$'],
            },
          },

          groups: [
            'react',
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],

          newlinesBetween: 'always',
        },
      ],

      'react/prop-types': 'off',
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.{js,jsx,ts,tsx}'],
  })),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    plugins: {
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      react: fixupPluginRules(react),
    },

    settings: {
      formComponents: ['Form'],

      'import/resolver': {
        typescript: {},
      },

      linkComponents: [
        {
          linkAttribute: 'to',
          name: 'Link',
        },
        {
          linkAttribute: 'to',
          name: 'NavLink',
        },
      ],

      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/prop-types': 0,
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],

    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      'import/internal-regex': '^#app/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },

        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
]
