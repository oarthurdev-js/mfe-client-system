module.exports = {
  root: false,
  env: { browser: true, es2020: true },
  extends: [
    '../../.eslintrc.js',
    'eslint:recommended',
    '@typescript-eslint/recommended',
    // Removendo a extensão que requer verificação de tipos
    // '@typescript-eslint/recommended-requiring-type-checking',
  ],
  ignorePatterns: ['dist', '.eslintrc.js', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
