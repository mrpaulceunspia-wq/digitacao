/* ARQUIVO: backend/src/middleware/traceId.js
 * RESPONSAVEL POR: Gerar traceId por request
 * DEPENDENCIAS: node:crypto
 */

import { randomUUID } from 'node:crypto';

export function traceId(req, res, next) {
  const id = randomUUID();
  req.traceId = id;
  res.locals.traceId = id;
  res.setHeader('x-trace-id', id);
  next();
}
