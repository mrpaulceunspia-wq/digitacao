/* 📁 ARQUIVO: backend/src/services/digitacoes.service.js
 * 🧠 RESPONSÁVEL POR: Regras de negócio de digitações e cálculos (tempo, gram média)
 * 🔗 DEPENDÊNCIAS: repositories/sqlite/digitacoes.repo, utils, AppError, MSG
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';
import { calcGramMedia } from '../core/utils/gramMedia.js';
import { diffMinutes } from '../core/utils/time.js';
import { createDigitacoesRepo } from '../repositories/sqlite/digitacoes.repo.js';

export function createDigitacoesService(deps) {
  const repo = createDigitacoesRepo(deps);

  function calcTempoField({ inicio, termino, fieldKey }) {
    if (!inicio || !termino) return null;
    const diff = diffMinutes(inicio, termino);
    if (diff === null) return null;
    if (diff < 0) {
      throw new AppError({
        status: 400,
        code: 'TIME_NEGATIVE',
        message: MSG.get('validation', 'timeNegative', { field: fieldKey }),
      });
    }
    return diff;
  }

  function compute(payload) {
    const tempoMin = payload.tempoMin ?? calcTempoField({ inicio: payload.inicio, termino: payload.termino, fieldKey: 'tempo' });
    const tempoParadaMin =
      payload.tempoParadaMin ??
      calcTempoField({ inicio: payload.paradaInicio, termino: payload.paradaFim, fieldKey: 'tempoParada' });

    const gramMedia =
      payload.gramMedia ??
      calcGramMedia({
        pesoLiquido: payload.pesoLiquido,
        metros: payload.metros,
        largura: payload.largura,
      });

    return { ...payload, tempoMin, tempoParadaMin, gramMedia };
  }

  return Object.freeze({
    async list({ query, pagination }) {
      return repo.list({ query, pagination });
    },

    async getById(id) {
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new AppError({
          status: 400,
          code: 'ID_INVALID',
          message: MSG.get('validation', 'invalid', { field: 'id' }),
        });
      }
      const row = await repo.getById(numericId);
      if (!row) throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
      return row;
    },

    async create(payload) {
      const computed = compute(payload);

      if (!computed.gramMedia && computed.pesoLiquido && computed.metros && computed.largura) {
        throw new AppError({
          status: 400,
          code: 'GRAM_INVALID',
          message: MSG.get('validation', 'gramCalcInvalid'),
        });
      }

      const created = await repo.create(computed);
      return created;
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
      const computed = compute(payload);

      const updated = await repo.update(numericId, computed);
      if (!updated) throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
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
      if (!removed) throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
      return removed;
    },
  });
}
