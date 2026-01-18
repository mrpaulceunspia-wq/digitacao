/* 📁 ARQUIVO: backend/src/core/messages/index.js
 * 🧠 RESPONSÁVEL POR: Expor MSG.get(cat, key, params)
 * 🔗 DEPENDÊNCIAS: ./pt-BR.js, ./fmt.js
 */

import { fmt } from './fmt.js';
import { PT_BR } from './pt-BR.js';

export const MSG = Object.freeze({
  get(cat, key, params = {}) {
    const category = PT_BR[cat] || {};
    const template = category[key] || '';
    return fmt(template, params);
  },
});
