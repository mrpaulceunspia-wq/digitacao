/* 📁 ARQUIVO: frontend/src/services/protheusApi.js
 * 🧠 RESPONSÁVEL POR: API Protheus (consulta de OFs)
 * 🔗 DEPENDÊNCIAS: apiFetch
 */

import { apiFetch } from './api.js';

export async function buscarOfs(numero) {
  const qs = new URLSearchParams({ numero });
  const res = await apiFetch(`/api/v1/protheus/ofs?${qs.toString()}`);
  return res.data;
}
