/* 📁 ARQUIVO: frontend/eslint.config.js
 * 🧠 RESPONSÁVEL POR: Regras ESLint do frontend (padrão Eng)
 * 🔗 DEPENDÊNCIAS: eslint, globals
 */

import globals from 'globals';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          groups: [['builtin', 'external', 'internal', 'parent', 'sibling', 'index']],
        },
      ],
    },
  },
];
