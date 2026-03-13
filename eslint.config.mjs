// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    react,
    'react-hooks': reactHooks,
  },
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    globals: {
      React: 'readonly',
      JSX: 'readonly',
    },
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    ...react.configs.recommended.rules,
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    ...reactHooks.configs.recommended.rules,
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
}, prettierConfig, {
  ignores: [
    'node_modules/**',
    'dist/**',
    '.turbo/**',
    'coverage/**',
    'storybook-static/**',
    '**/*.min.js',
  ],
}, ...storybook.configs["flat/recommended"]];
