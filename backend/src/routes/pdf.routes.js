/* ARQUIVO: backend/src/routes/pdf.routes.js
 * RESPONSAVEL POR: Rotas de PDF
 * DEPENDENCIAS: express, controllers
 */

import { Router } from 'express';

import { createPdfController } from '../controllers/pdf.controller.js';

export function createPdfRoutes() {
  const router = Router();
  const controller = createPdfController();

  router.get('/:template?', controller.render);

  return router;
}
