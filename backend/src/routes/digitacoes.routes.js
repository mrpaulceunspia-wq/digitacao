/* 📁 ARQUIVO: backend/src/routes/digitacoes.routes.js
 * 🧠 RESPONSÁVEL POR: Rotas de digitações
 * 🔗 DEPENDÊNCIAS: express, controllers, validate, zod, pagination
 */

import { Router } from 'express';
import { z } from 'zod';

import { createDigitacoesController } from '../controllers/digitacoes.controller.js';
import { parsePagination } from '../middleware/pagination.js';
import { validate } from '../middleware/validate.js';

const digitacaoBodySchema = z.object({
  linha: z.coerce.number().int(),
  data: z.string().min(8),
  turno: z.string().min(1),

  operadorId: z.coerce.number().int(),
  ajudanteId: z.coerce.number().int().optional().nullable(),

  ofNumero: z.string().min(1),
  ofItem: z.string().min(1),
  codProduto: z.string().min(1),
  produto: z.string().min(1),
  cliente: z.string().optional().nullable(),

  numBobina: z.string().optional().nullable(),
  pesoLiquido: z.coerce.number().optional().nullable(),
  metros: z.coerce.number().optional().nullable(),
  largura: z.coerce.number().optional().nullable(),
  gramMedia: z.coerce.number().optional().nullable(),

  inicio: z.string().optional().nullable(),
  termino: z.string().optional().nullable(),
  tempoMin: z.coerce.number().int().optional().nullable(),

  tipoFibra: z.enum(['F1', 'F2', 'F4', 'F5', 'F6']).optional().nullable(),
  numRolinhos: z.coerce.number().int().optional().nullable(),
  peso: z.coerce.number().optional().nullable(),

  colaNumero: z.string().optional().nullable(),
  colaCarga: z.string().optional().nullable(),
  pesoRefugo: z.coerce.number().optional().nullable(),
  aprovado: z.coerce.number().int().min(0).max(1).optional().nullable(),

  paradaInicio: z.string().optional().nullable(),
  paradaFim: z.string().optional().nullable(),
  tempoParadaMin: z.coerce.number().int().optional().nullable(),
  motivo: z.string().optional().nullable(),

  observacoes: z.string().optional().nullable(),
});

const listQuerySchema = z.object({
  linha: z.coerce.number().int().optional(),
  numBobina: z.string().optional(),
  ofNumero: z.string().optional(),
  ofItem: z.string().optional(),
  dataDe: z.string().optional(),
  dataAte: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export function createDigitacoesRoutes(deps) {
  const router = Router();
  const controller = createDigitacoesController(deps);

  router.get('/', validate(listQuerySchema, 'query'), parsePagination, controller.list);
  router.get('/:id', controller.getById);
  router.post('/', validate(digitacaoBodySchema), controller.create);
  router.put('/:id', validate(digitacaoBodySchema), controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
