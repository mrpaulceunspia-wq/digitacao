/* 📁 ARQUIVO: backend/eslint.config.js
 * 🧠 RESPONSÁVEL POR: Regras ESLint do backend (padrão Eng)
 * 🔗 DEPENDÊNCIAS: eslint, globals
 */

import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'logs/**', 'data/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
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
