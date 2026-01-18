/* 📁 ARQUIVO: backend/src/controllers/pessoas.controller.js
 * 🧠 RESPONSÁVEL POR: Controller de pessoas (HTTP → Service)
 * 🔗 DEPENDÊNCIAS: services/pessoas.service
 */

import { ok, created } from '../core/http/respond.js';
import { createPessoasService } from '../services/pessoas.service.js';

export function createPessoasController(deps) {
  const service = createPessoasService(deps);

  return Object.freeze({
    async list(req, res, next) {
      try {
        const data = await service.list(req.query);
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
        const updated = await service.update(req.params.id, req.body);
        return ok(res, updated);
      } catch (err) {
        return next(err);
      }
    },

    async disable(req, res, next) {
      try {
        const data = await service.disable(req.params.id);
        return ok(res, data);
      } catch (err) {
        return next(err);
      }
    },
  });
}
