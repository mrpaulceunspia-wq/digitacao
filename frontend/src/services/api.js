/* 📁 ARQUIVO: frontend/src/services/api.js
 * 🧠 RESPONSÁVEL POR: Cliente fetch (base relativa, compatível com proxy do Vite)
 * 🔗 DEPENDÊNCIAS: notifier, MSG
 */

import { MSG } from '../ui/messages/index.js';
import { notifier } from '../ui/notify/notifier.js';

export async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    const message = payload?.message || MSG.get('general', 'httpError', { status: res.status });
    notifier.error(message);
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
