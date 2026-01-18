/* 📁 ARQUIVO: backend/src/core/utils/time.js
 * 🧠 RESPONSÁVEL POR: Cálculo de diferença entre horários HH:MM
 * 🔗 DEPENDÊNCIAS: Nenhuma
 */

export function parseTimeToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return null;
  const m = hhmm.match(/^(\d{2}):(\d{2})$/);
  if (!m) return null;

  const hh = Number(m[1]);
  const mm = Number(m[2]);

  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;

  return hh * 60 + mm;
}

export function diffMinutes(startHHMM, endHHMM) {
  const s = parseTimeToMinutes(startHHMM);
  const e = parseTimeToMinutes(endHHMM);
  if (s === null || e === null) return null;
  return e - s;
}
