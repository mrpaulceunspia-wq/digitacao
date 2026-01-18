/* 📁 ARQUIVO: frontend/src/services/pessoasApi.js
 * 🧠 RESPONSÁVEL POR: API de pessoas
 * 🔗 DEPENDÊNCIAS: apiFetch
 */

import { apiFetch } from './api.js';

export async function listPessoas({ papel, ativo = 1 }) {
  const qs = new URLSearchParams();
  if (papel) qs.set('papel', papel);
  if (ativo !== undefined) qs.set('ativo', String(ativo));
  const res = await apiFetch(`/api/v1/pessoas?${qs.toString()}`);
  return res.data;
}

export async function createPessoa(payload) {
  const res = await apiFetch('/api/v1/pessoas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function disablePessoa(id) {
  const res = await apiFetch(`/api/v1/pessoas/${id}`, { method: 'DELETE' });
  return res.data;
}
