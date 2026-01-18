/* 📁 ARQUIVO: backend/src/middleware/pagination.js
 * 🧠 RESPONSÁVEL POR: Extrair paginação, filtros e ordenação
 * 🔗 DEPENDÊNCIAS: AppError, MSG
 */

import { AppError } from '../core/errors/appError.js';
import { MSG } from '../core/messages/index.js';

export function parsePagination(req, _res, next) {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 20);

  if (
    Number.isNaN(page) ||
    Number.isNaN(pageSize) ||
    page < 1 ||
    pageSize < 1 ||
    pageSize > 200
  ) {
    return next(
      new AppError({
        status: 400,
        code: 'PAGINATION_INVALID',
        message: MSG.get('validation', 'paginationInvalid'),
      }),
    );
  }

  req.pagination = Object.freeze({
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  return next();
}
