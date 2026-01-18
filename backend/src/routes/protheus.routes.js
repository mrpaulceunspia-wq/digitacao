/* 📁 ARQUIVO: backend/src/routes/protheus.routes.js
 * 🧠 RESPONSÁVEL POR: Rotas Protheus (consulta de OF)
 * 🔗 DEPENDÊNCIAS: express, controllers, validate, zod
 */

import { Router } from 'express';
import { z } from 'zod';

import { createProtheusController } from '../controllers/protheus.controller.js';
import { validate } from '../middleware/validate.js';

const ofsQuerySchema = z.object({
  numero: z.string().min(1),
});

const gramaturaQuerySchema = z.object({
  produto: z.string().min(1),
  linha: z.string().min(1),
});

export function createProtheusRoutes(deps) {
  const router = Router();
  const controller = createProtheusController(deps);

  router.get('/ofs', validate(ofsQuerySchema, 'query'), controller.listOfs);
  router.get('/gramatura', validate(gramaturaQuerySchema, 'query'), controller.getGramatura);

  return router;
}
