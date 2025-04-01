module.exports = {
  env: {
    browser: true,
    jest: true,
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
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: ['frontend/**/*.js', 'frontend/**/*.jsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime',
      ],
      plugins: ['react', 'react-hooks'],
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
  plugins: [],
  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off', // Not needed for React 17+
    'react/prop-types': 'off', // Disable if using TypeScript
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
        trailingComma: 'all',
        arrowParens: 'avoid',
      },
    ],
  },
};
