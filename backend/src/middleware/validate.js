/* 📁 ARQUIVO: backend/src/middleware/validate.js
 * 🧠 RESPONSÁVEL POR: Middleware de validação com Zod
 * 🔗 DEPENDÊNCIAS: zod, AppError
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';

export function validate(schema, where = 'body') {
  return function validateMiddleware(req, _res, next) {
    const data = where === 'query' ? req.query : req.body;

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));

      return next(
        new AppError({
          status: 400,
          code: 'VALIDATION_ERROR',
          message: MSG.get('validation', 'invalid', { field: where }),
          details,
        }),
      );
    }

    if (where === 'query') req.query = parsed.data;
    else req.body = parsed.data;

    return next();
  };
}
