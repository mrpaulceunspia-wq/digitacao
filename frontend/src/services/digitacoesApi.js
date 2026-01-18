/* 📁 ARQUIVO: frontend/src/services/digitacoesApi.js
 * 🧠 RESPONSÁVEL POR: API de digitações
 * 🔗 DEPENDÊNCIAS: apiFetch
 */

import { apiFetch } from './api.js';

export async function criarDigitacao(payload) {
  const res = await apiFetch('/api/v1/digitacoes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function listarDigitacoes(params = {}) {
  const qs = new URLSearchParams(params);
  const res = await apiFetch(`/api/v1/digitacoes?${qs.toString()}`);
  return res;
}

export async function buscarDigitacao(id) {
  const res = await apiFetch(`/api/v1/digitacoes/${id}`);
  return res.data;
}

export async function atualizarDigitacao(id, payload) {
  const res = await apiFetch(`/api/v1/digitacoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function removerDigitacao(id) {
  const res = await apiFetch(`/api/v1/digitacoes/${id}`, { method: 'DELETE' });
  return res.data;
}
