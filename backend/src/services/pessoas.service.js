/* 📁 ARQUIVO: backend/src/services/pessoas.service.js
 * 🧠 RESPONSÁVEL POR: Regras de negócio de pessoas
 * 🔗 DEPENDÊNCIAS: repositories/sqlite/pessoas.repo, AppError, MSG
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';
import { createPessoasRepo } from '../repositories/sqlite/pessoas.repo.js';

export function createPessoasService(deps) {
  const repo = createPessoasRepo(deps);

  function normalizeRoleFilter(papel) {
    if (!papel) return null;
    if (papel === 'OPERADOR') return ['OPERADOR', 'AMBOS'];
    if (papel === 'AJUDANTE') return ['AJUDANTE', 'AMBOS'];
    return null;
  }

  return Object.freeze({
    async list({ papel, search, ativo }) {
      const tipos = normalizeRoleFilter(papel);
      return repo.list({ tipos, search, ativo });
    },

    async create({ nome, tipo }) {
      if (!nome) {
        throw new AppError({
          status: 400,
          code: 'NOME_REQUIRED',
          message: MSG.get('validation', 'required', { field: 'nome' }),
        });
      }

      const created = await repo.create({ nome: nome.trim(), tipo });
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
      const updated = await repo.update(numericId, payload);
      if (!updated) {
        throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
      }
      return updated;
    },

    async disable(id) {
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new AppError({
          status: 400,
          code: 'ID_INVALID',
          message: MSG.get('validation', 'invalid', { field: 'id' }),
        });
      }

      const disabled = await repo.disable(numericId);
      if (!disabled) {
        throw new AppError({ status: 404, code: 'NOT_FOUND', message: MSG.get('general', 'notFound') });
      }

      return disabled;
    },
  });
}
