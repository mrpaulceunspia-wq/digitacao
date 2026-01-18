/* ARQUIVO: backend/src/services/motivos.service.js
 * RESPONSAVEL POR: Regras de negocio de motivos
 * DEPENDENCIAS: repositories/sqlite/motivos.repo, AppError, MSG
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';
import { createMotivosRepo } from '../repositories/sqlite/motivos.repo.js';

export function createMotivosService(deps) {
  const repo = createMotivosRepo(deps);

  function normalizeCodigo(codigo) {
    return String(codigo || '').trim();
  }

  function normalizeMotivo(motivo) {
    return String(motivo || '').trim();
  }

  return Object.freeze({
    async list({ search }) {
      return repo.list({ search });
    },

    async create({ codigo, motivo }) {
      const nextCodigo = normalizeCodigo(codigo);
      const nextMotivo = normalizeMotivo(motivo);

      if (!nextCodigo) {
        throw new AppError({
          status: 400,
          code: 'CODIGO_REQUIRED',
          message: MSG.get('validation', 'required', { field: 'codigo' }),
        });
      }
      if (!nextMotivo) {
        throw new AppError({
          status: 400,
          code: 'MOTIVO_REQUIRED',
          message: MSG.get('validation', 'required', { field: 'motivo' }),
        });
      }

      return repo.create({ codigo: nextCodigo, motivo: nextMotivo });
    },

    async update(id, payload) {
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new AppError({
          status: 400,
          code: 'ID_INVALID',
          message: MSG.get('validation', 'invalid', { field: 'id' }),
        });
      }

      const next = {
        codigo: payload.codigo ? normalizeCodigo(payload.codigo) : undefined,
        motivo: payload.motivo ? normalizeMotivo(payload.motivo) : undefined,
      };

      const updated = await repo.update(numericId, next);
      if (!updated) {
        throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
      }
      return updated;
    },

    async remove(id) {
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new AppError({
          status: 400,
          code: 'ID_INVALID',
          message: MSG.get('validation', 'invalid', { field: 'id' }),
        });
      }

      const removed = await repo.remove(numericId);
      if (!removed) {
        throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
      }
      return removed;
    },
  });
}
