// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = tseslint.config(
  eslint.configs.recommended,
  {
    files: ['**/*.ts', 'playwright.config.ts'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.json', './playwright/tsconfig.json'],
      },
    },
    rules: {
      'max-len': ['error', 160],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'max-len': ['error', 160],
    },
  }
);
