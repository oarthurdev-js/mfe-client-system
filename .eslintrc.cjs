module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  // Ignorar completamente os arquivos vite.config.ts para evitar problemas de parsing
  ignorePatterns: ['dist', '.eslintrc.js', '.eslintrc.cjs', '**/vite.config.ts'],
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
  }
}