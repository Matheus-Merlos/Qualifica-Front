import css from '@eslint/css';
import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  // Ignora pastas/padrões no nível global
  {
    ignores: ['node_modules', 'dist', '**/*.min.*', '**/vendor/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      js,
      prettier: pluginPrettier,
      react: pluginReact,
    },
    languageOptions: {
      globals: globals.browser,
    },
    extends: ['js/recommended', pluginReact.configs.flat.recommended],
    rules: {
      'prettier/prettier': 'error',
      'react/self-closing-comp': 'error',
    },
  },
  {
    name: 'prettier-config',
    rules: configPrettier.rules,
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
]);
