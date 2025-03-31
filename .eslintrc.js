module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser', // Updated from 'babel-eslint'
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    requireConfigFile: false, // No external Balbe config needed
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect', // Auto-detect React version
    },
  },
  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off', // Not needed for React 17+
    'react/prop-types': 'off', // Disable if using TypeScript
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
