/* 📁 ARQUIVO: backend/src/core/utils/gramMedia.js
 * 🧠 RESPONSÁVEL POR: Cálculo de Gram. Média
 * 🔗 DEPENDÊNCIAS: Nenhuma
 */

export function calcGramMedia({ pesoLiquido, metros, largura }) {
  const p = Number(pesoLiquido);
  const m = Number(metros);
  const l = Number(largura);

  if ([p, m, l].some((n) => Number.isNaN(n))) return null;
  if (p <= 0 || m <= 0 || l <= 0) return null;

  const value = (p / m / l) * 1000000;
  return Math.round(value * 100) / 100;
}
