/* ARQUIVO: backend/src/core/http/respond.js
 * RESPONSAVEL POR: Helpers de resposta com envelope + traceId
 * DEPENDENCIAS: Nenhuma
 */

export function ok(res, data, meta = null) {
  const payload = {
    ok: true,
    data,
    traceId: res.locals.traceId,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.json(payload);
}

export function created(res, data, meta = null) {
  const payload = {
    ok: true,
    data,
    traceId: res.locals.traceId,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(201).json(payload);
}
