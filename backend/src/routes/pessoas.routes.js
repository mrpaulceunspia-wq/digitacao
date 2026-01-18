/* 📁 ARQUIVO: backend/src/routes/pessoas.routes.js
 * 🧠 RESPONSÁVEL POR: Rotas de pessoas
 * 🔗 DEPENDÊNCIAS: express, controllers, validate, zod
 */

import { Router } from 'express';
import { z } from 'zod';

import { createPessoasController } from '../controllers/pessoas.controller.js';
import { validate } from '../middleware/validate.js';

const pessoaBodySchema = z.object({
  nome: z.string().min(2),
  tipo: z.enum(['OPERADOR', 'AJUDANTE', 'AMBOS']),
});

const pessoaUpdateSchema = z.object({
  nome: z.string().min(2).optional(),
  tipo: z.enum(['OPERADOR', 'AJUDANTE', 'AMBOS']).optional(),
  ativo: z.coerce.number().int().min(0).max(1).optional(),
});

const listQuerySchema = z.object({
  papel: z.enum(['OPERADOR', 'AJUDANTE']).optional(),
  search: z.string().optional(),
  ativo: z.coerce.number().int().min(0).max(1).optional(),
});

export function createPessoasRoutes(deps) {
  const router = Router();
  const controller = createPessoasController(deps);

  router.get('/', validate(listQuerySchema, 'query'), controller.list);
  router.post('/', validate(pessoaBodySchema), controller.create);
  router.put('/:id', validate(pessoaUpdateSchema), controller.update);
  router.delete('/:id', controller.disable);

  return router;
}
