/* 📁 ARQUIVO: backend/src/middleware/notFound.js
 * 🧠 RESPONSÁVEL POR: Middleware 404
 * 🔗 DEPENDÊNCIAS: AppError, MSG
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';

export function notFound(req, _res, next) {
  return next(
    new AppError({
      status: 404,
      code: 'NOT_FOUND',
      message: MSG.get('general', 'notFound'),
      details: { path: req.path },
    }),
  );
}
