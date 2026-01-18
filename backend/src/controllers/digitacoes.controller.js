/* 📁 ARQUIVO: backend/src/controllers/digitacoes.controller.js
 * 🧠 RESPONSÁVEL POR: Controller de digitações (HTTP → Service)
 * 🔗 DEPENDÊNCIAS: services/digitacoes.service
 */

import { ok, created } from '../core/http/respond.js';
import { createDigitacoesService } from '../services/digitacoes.service.js';

export function createDigitacoesController(deps) {
  const service = createDigitacoesService(deps);

  return Object.freeze({
    async list(req, res, next) {
      try {
        const data = await service.list({ query: req.query, pagination: req.pagination });
        return ok(res, data.items, { page: data.page, pageSize: data.pageSize, total: data.total });
      } catch (err) {
        return next(err);
      }
    },

    async getById(req, res, next) {
      try {
        const data = await service.getById(req.params.id);
        return ok(res, data);
      } catch (err) {
        return next(err);
      }
    },

    async create(req, res, next) {
      try {
        const data = await service.create(req.body);
        return created(res, data);
      } catch (err) {
        return next(err);
      }
    },

    async update(req, res, next) {
      try {
        const data = await service.update(req.params.id, req.body);
        return ok(res, data);
      } catch (err) {
        return next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const data = await service.remove(req.params.id);
        return ok(res, data);
      } catch (err) {
        return next(err);
      }
    },
  });
}
