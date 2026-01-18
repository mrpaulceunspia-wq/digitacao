/* ARQUIVO: backend/src/core/errors/errorHandler.js
 * RESPONSAVEL POR: Middleware centralizado de erro
 * DEPENDENCIAS: logger
 */

import { AppError } from './appError.js';

export function createErrorHandler({ logger }) {
  return function errorHandler(err, req, res, next) {
    const isApp = err instanceof AppError;
    const status = isApp ? err.status : 500;
    const traceId = res.locals.traceId;

    logger.error(
      JSON.stringify({
        status,
        code: isApp ? err.code : 'UNHANDLED',
        message: err.message,
        path: req.path,
        method: req.method,
        traceId,
      }),
    );

    res.status(status).json({
      ok: false,
      code: isApp ? err.code : 'UNHANDLED',
      message: err.message,
      details: isApp ? err.details : null,
      traceId,
    });

    next();
  };
}
