/* 📁 ARQUIVO: backend/src/core/db/mssql.js
 * 🧠 RESPONSÁVEL POR: Conexão com SQL Server (Protheus) via mssql
 * 🔗 DEPENDÊNCIAS: mssql, MSG
 */

import sql from 'mssql';

import { MSG } from '../messages/index.js';

export async function connectMssql({ env, logger }) {
  const server = env.MSSQL_SERVER;
  const database = env.MSSQL_DATABASE;
  const user = env.MSSQL_USER;
  const password = env.MSSQL_PASSWORD;

  if (!server || !database || !user || !password) {
    logger.say('warn', 'db', 'mssqlDisabled');
    return null;
  }

  const encrypt = String(env.MSSQL_ENCRYPT || 'false').toLowerCase() === 'true';

  const config = {
    server,
    database,
    user,
    password,
    options: {
      encrypt,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  const pool = await sql.connect(config);
  logger.say('success', 'db', 'mssqlConnected', { server, database });
  return pool;
}
