/* ARQUIVO: backend/src/routes/motivos.routes.js
 * RESPONSAVEL POR: Rotas de motivos
 * DEPENDENCIAS: express, controllers, validate, zod
 */

import { Router } from 'express';
import { z } from 'zod';

import { createMotivosController } from '../controllers/motivos.controller.js';
import { validate } from '../middleware/validate.js';

const motivoBodySchema = z.object({
  codigo: z.string().min(1),
  motivo: z.string().min(1),
});

const motivoUpdateSchema = z.object({
  codigo: z.string().min(1).optional(),
  motivo: z.string().min(1).optional(),
});

const listQuerySchema = z.object({
  search: z.string().optional(),
});

export function createMotivosRoutes(deps) {
  const router = Router();
  const controller = createMotivosController(deps);

  router.get('/', validate(listQuerySchema, 'query'), controller.list);
  router.post('/', validate(motivoBodySchema), controller.create);
  router.put('/:id', validate(motivoUpdateSchema), controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
