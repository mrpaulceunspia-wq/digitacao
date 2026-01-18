/* 📁 ARQUIVO: backend/src/core/errors/appError.js
 * 🧠 RESPONSÁVEL POR: Classe de erro padronizada
 * 🔗 DEPENDÊNCIAS: Nenhuma
 */

export class AppError extends Error {
  constructor({ message, status = 400, code = 'APP_ERROR', details = null }) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
