module.exports = {
  parser: 'babel-eslint', // Or "eslint-parser"
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'no-unused-vars': 'warn',
    'prettier/prettier': 'error',
  },
  parserOptions: {
    ecmaVersion: 2021, // This should be ES2021 or above for modern syntax
    sourceType: 'module', // Enables 'import' and 'export' statements
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
  },
};
