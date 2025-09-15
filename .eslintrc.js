module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: null
  },
  plugins: ['@typescript-eslint'],
  rules: {},
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  overrides: [
    {
      files: ['**/vite.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: null
      }
    },
    {
      files: ['packages/shell/vite.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: require('path').resolve(__dirname, 'packages/shell'),
        project: null
      }
    },
    {
      files: ['packages/auth-mfe/vite.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: require('path').resolve(__dirname, 'packages/auth-mfe'),
        project: null
      }
    },
    {
      files: ['packages/clients-mfe/vite.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: require('path').resolve(__dirname, 'packages/clients-mfe'),
        project: null
      }
    },
    {
      files: ['packages/design-system/vite.config.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: require('path').resolve(__dirname, 'packages/design-system'),
        project: null
      }
    }
  ]
}