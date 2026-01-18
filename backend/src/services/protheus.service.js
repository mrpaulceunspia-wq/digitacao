/* 📁 ARQUIVO: backend/src/services/protheus.service.js
 * 🧠 RESPONSÁVEL POR: Regras de consulta ao Protheus (OFs)
 * 🔗 DEPENDÊNCIAS: repositories/protheus/ofs.repo, AppError, MSG
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';
import { createOfsRepo } from '../repositories/protheus/ofs.repo.js';

export function createProtheusService(deps) {
  const repo = createOfsRepo(deps);

  return Object.freeze({
    async listOfs(numero) {
      const ofs = await repo.listByNumero(numero);
      if (!ofs.length) {
        return { items: [], message: MSG.get('protheus', 'ofsNone') };
      }
      return { items: ofs, message: MSG.get('protheus', 'ofsOk', { count: ofs.length }) };
    },

    async getGramatura({ produto, linha }) {
      const row = await repo.getGramatura({ produto, linha });
      if (!row) {
        return { gramDe: null, gramAte: null, criterio: null };
      }
      return {
        gramDe: row.gramDe ?? null,
        gramAte: row.gramAte ?? null,
        criterio: row.criterio ?? null,
      };
    },
  });
}
