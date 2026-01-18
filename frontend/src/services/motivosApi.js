/* ARQUIVO: frontend/src/services/motivosApi.js
 * RESPONSAVEL POR: API de motivos
 * DEPENDENCIAS: apiFetch
 */

import { apiFetch } from './api.js';

export async function listMotivos(params = {}) {
  const qs = new URLSearchParams(params);
  const res = await apiFetch(`/api/v1/motivos?${qs.toString()}`);
  return res.data;
}

export async function createMotivo(payload) {
  const res = await apiFetch('/api/v1/motivos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateMotivo(id, payload) {
  const res = await apiFetch(`/api/v1/motivos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function removeMotivo(id) {
  const res = await apiFetch(`/api/v1/motivos/${id}`, { method: 'DELETE' });
  return res.data;
}
