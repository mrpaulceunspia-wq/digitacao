/* 📁 ARQUIVO: frontend/src/ui/notify/notifier.js
 * 🧠 RESPONSÁVEL POR: Notificador unificado (success, error, info, warn)
 * 🔗 DEPENDÊNCIAS: MSG
 */

import { MSG } from '../messages/index.js';

let _push = null;

export const notifier = Object.freeze({
  bind(pushFn) {
    _push = pushFn;
  },

  success(message) {
    if (_push) _push({ type: 'success', message });
  },
  error(message) {
    if (_push) _push({ type: 'error', message });
  },
  info(message) {
    if (_push) _push({ type: 'info', message });
  },
  warn(message) {
    if (_push) _push({ type: 'warn', message });
  },

  say(type, cat, key, params) {
    const message = MSG.get(cat, key, params);
    if (_push) _push({ type, message });
  },
});
