/* 📁 ARQUIVO: backend/src/core/messages/fmt.js
 * 🧠 RESPONSÁVEL POR: Interpolação simples de mensagens (${var})
 * 🔗 DEPENDÊNCIAS: Nenhuma
 */

export function fmt(template, params = {}) {
  if (!template) return '';
  return String(template).replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = params[key];
    return value === undefined || value === null ? '' : String(value);
  });
}
