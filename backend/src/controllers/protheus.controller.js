/* 📁 ARQUIVO: backend/src/controllers/protheus.controller.js
 * 🧠 RESPONSÁVEL POR: Controller Protheus (HTTP → Service)
 * 🔗 DEPENDÊNCIAS: services/protheus.service
 */

import { ok } from '../core/http/respond.js';
import { createProtheusService } from '../services/protheus.service.js';

export function createProtheusController(deps) {
  const service = createProtheusService(deps);

  return Object.freeze({
    async listOfs(req, res, next) {
      try {
        const data = await service.listOfs(req.query.numero);
        return ok(res, data);
      } catch (err) {
        return next(err);
      }
    },

    async getGramatura(req, res, next) {
      try {
        const data = await service.getGramatura({
          produto: req.query.produto,
          linha: req.query.linha,
        });
        return ok(res, data);
      } catch (err) {
        return next(err);
      }
    },
  });
}
