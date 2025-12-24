const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      // Prettier rules
      'prettier/prettier': 'error',
      'arrow-parens': ['error', 'always'],
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // General ESLint rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'warn',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      'func-style': ['error', 'expression'],
      
      // Code style
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      quotes: [2, 'single', 'avoid-escape'],

    },
  },
  {
    ignores: ['dist/', 'node_modules/', '**/*.js'],
  },
];