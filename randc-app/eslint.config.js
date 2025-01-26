import { defineConfig } from 'eslint-define-config';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// This import *and usage* is crucial to parse TS:
import { configs as tsConfigs } from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default defineConfig([
  {
    ignores: ['dist'],
  },
  {
    // We must specify the TS parser
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      // if you use project references:
      // project: './tsconfig.json',
    },
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        // any other global variables
      },
    },

    // extends recommended configs from ESLint + TS
    extends: [
      js.configs.recommended,
      ...Object.values(tsConfigs.recommended), // or tsConfigs['recommended'],
    ],

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      // '@typescript-eslint' is automatically loaded
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Turn off no-explicit-any if you want to allow `any`
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
