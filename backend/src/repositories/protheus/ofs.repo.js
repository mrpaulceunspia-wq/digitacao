/* 📁 ARQUIVO: backend/src/repositories/protheus/ofs.repo.js
 * 🧠 RESPONSÁVEL POR: Query SQL Server (Protheus) para buscar OFs (SC6010 + SA1010)
 * 🔗 DEPENDÊNCIAS: mssql pool
 */

import sql from 'mssql';

import { AppError } from '../../core/errors/appError.js';
import { MSG } from '../../core/messages/index.js';

export function createOfsRepo({ mssqlPool, logger }) {
  return Object.freeze({
    async listByNumero(numero) {
      if (!mssqlPool) {
        throw new AppError({
          status: 503,
          code: 'MSSQL_UNAVAILABLE',
          message: MSG.get('db', 'mssqlDisabled'),
        });
      }

      try {
        const req = mssqlPool.request();
        req.input('numero', sql.VarChar, `${numero}%`);

        // Observação Protheus:
        // - SC6010: itens da OF / Pedido de venda (dependendo do setup)
        // - Campos: C6_NUM, C6_ITEM, C6_PRODUTO, C6_DESCRI
        // - Cliente em SA1010 (A1_NOME) via C6_CLI/C6_LOJA
        const query = `
          SELECT TOP 50
            C6.C6_NUM     AS ofNumero,
            C6.C6_ITEM    AS ofItem,
            C6.C6_PRODUTO AS codProduto,
            C6.C6_DESCRI  AS produto,
            A1.A1_NOME    AS cliente
          FROM SC6010 C6
          LEFT JOIN SA1010 A1
            ON A1.A1_COD  = C6.C6_CLI
           AND A1.A1_LOJA = C6.C6_LOJA
           AND A1.D_E_L_E_T_ <> '*'
          WHERE C6.C6_NUM LIKE @numero
            AND C6.D_E_L_E_T_ <> '*'
          ORDER BY C6.C6_NUM DESC, C6.C6_ITEM ASC
        `;

        const result = await req.query(query);
        return result.recordset || [];
      } catch (_err) {
        if (logger?.error) {
          const detail = _err?.message ? _err.message : String(_err);
          const mssqlCode = _err?.code || null;
          logger.error(JSON.stringify({ code: 'PROTHEUS_QUERY_ERROR', detail, mssqlCode }));
        }
        throw new AppError({
          status: 502,
          code: 'PROTHEUS_QUERY_ERROR',
          message: MSG.get('protheus', 'queryError'),
        });
      }
    },

    async getGramatura({ produto, linha }) {
      if (!mssqlPool) {
        throw new AppError({
          status: 503,
          code: 'MSSQL_UNAVAILABLE',
          message: MSG.get('db', 'mssqlDisabled'),
        });
      }

      try {
        const req = mssqlPool.request();
        const linhaLabel = `LINHA ${linha}`;
        req.input('produto', sql.VarChar, produto);
        req.input('linha', sql.VarChar, linhaLabel);

        const query = `
          SELECT TOP 1
            QP7.QP7_LIC   AS gramDe,
            QP7.QP7_LSC   AS gramAte,
            QQK.QQK_DESCRI AS criterio
          FROM QQK010 QQK
          INNER JOIN QP7010 QP7
            ON RTRIM(QP7.QP7_PRODUT) = RTRIM(QQK.QQK_PRODUT)
           AND QP7.D_E_L_E_T_ <> '*'
          WHERE RTRIM(QQK.QQK_PRODUT) = RTRIM(@produto)
            AND QQK.D_E_L_E_T_ <> '*'
            AND (RTRIM(QQK.QQK_DESCRI) = @linha OR RTRIM(QQK.QQK_DESCRI) = 'FINAL')
          ORDER BY CASE WHEN RTRIM(QQK.QQK_DESCRI) = @linha THEN 0 ELSE 1 END
        `;

        const result = await req.query(query);
        const row = result.recordset?.[0] || null;
        return row;
      } catch (_err) {
        if (logger?.error) {
          const detail = _err?.message ? _err.message : String(_err);
          const mssqlCode = _err?.code || null;
          logger.error(JSON.stringify({ code: 'PROTHEUS_QUERY_ERROR', detail, mssqlCode }));
        }
        throw new AppError({
          status: 502,
          code: 'PROTHEUS_QUERY_ERROR',
          message: MSG.get('protheus', 'queryError'),
        });
      }
    },
  });
}
