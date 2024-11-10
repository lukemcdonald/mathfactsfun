/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  // Base config
  extends: [
    'eslint:recommended',
    'plugin:perfectionist/recommended-natural-legacy',
    'prettier',
  ],
  ignorePatterns: ['!**/.server', '!**/.client'],
  overrides: [
    // React
    {
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'jsx-a11y'],
      rules: {
        'react/prop-types': 0,
      },
      settings: {
        formComponents: ['Form'],
        'import/resolver': {
          typescript: {},
        },
        linkComponents: [
          { linkAttribute: 'to', name: 'Link' },
          { linkAttribute: 'to', name: 'NavLink' },
        ],
        react: {
          version: 'detect',
        },
      },
    },

    // Typescript
    {
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'import'],
      settings: {
        'import/internal-regex': '^~/',
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

    // Node
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.cjs'],
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: ['perfectionist'],
  root: true,
  rules: {
    'react/prop-types': 'off',
  },
}
