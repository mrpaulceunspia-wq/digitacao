/* 📁 ARQUIVO: backend/src/app.js
 * 🧠 RESPONSÁVEL POR: Montar app Express com middlewares e rotas
 * 🔗 DEPENDÊNCIAS: express, cors, helmet, routes, errorHandler
 */

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { createErrorHandler } from './core/errors/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { traceId } from './middleware/traceId.js';
import { createRoutes } from './routes/index.js';

export function createApp(deps) {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(traceId);

  app.use('/api/v1', createRoutes(deps));
  app.use(notFound);
  app.use(createErrorHandler(deps));

  return app;
}
