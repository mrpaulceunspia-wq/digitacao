/* ARQUIVO: backend/src/controllers/motivos.controller.js
 * RESPONSAVEL POR: Controller de motivos (HTTP -> Service)
 * DEPENDENCIAS: services/motivos.service
 */

import { ok, created } from '../core/http/respond.js';
import { createMotivosService } from '../services/motivos.service.js';

export function createMotivosController(deps) {
  const service = createMotivosService(deps);

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
