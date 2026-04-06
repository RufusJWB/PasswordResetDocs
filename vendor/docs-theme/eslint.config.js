// @ts-check

const eslint = require('@eslint/js');
const eslintPluginCypress = require('eslint-plugin-cypress');
const globals = require('globals');

module.exports = [
  eslint.configs.recommended,
  eslintPluginCypress.configs.globals,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node
    },
    rules: {
      'max-len': ['error', 160]
    }
  }
];
