/* 📁 ARQUIVO: backend/src/routes/index.js
 * 🧠 RESPONSÁVEL POR: Montar rotas da API (v1)
 * 🔗 DEPENDÊNCIAS: express, controllers
 */

import { Router } from 'express';

import { ok } from '../core/http/respond.js';
import { createDigitacoesRoutes } from './digitacoes.routes.js';
import { createMotivosRoutes } from './motivos.routes.js';
import { createPessoasRoutes } from './pessoas.routes.js';
import { createPdfRoutes } from './pdf.routes.js';
import { createProtheusRoutes } from './protheus.routes.js';

export function createRoutes(deps) {
  const router = Router();

  router.get('/health', (_req, res) => ok(res, { status: 'ok' }));

  router.use('/pessoas', createPessoasRoutes(deps));
  router.use('/digitacoes', createDigitacoesRoutes(deps));
  router.use('/motivos', createMotivosRoutes(deps));
  router.use('/protheus', createProtheusRoutes(deps));
  router.use('/pdf', createPdfRoutes(deps));

  return router;
}
