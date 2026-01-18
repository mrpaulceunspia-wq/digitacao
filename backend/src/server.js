/* ARQUIVO: backend/src/server.js
 * RESPONSAVEL POR: Bootstrap do backend (env, logger, db, servidor)
 * DEPENDENCIAS: dotenv, createApp, sqlite, mssql, MSG
 */

import fs from 'node:fs';
import path from 'node:path';

import dotenv from 'dotenv';

import { createApp } from './app.js';
import { connectMssql } from './core/db/mssql.js';
import { ensureSchema, openSqlite } from './core/db/sqlite.js';
import { createLogger } from './core/logger/logger.js';
import { MSG } from './core/messages/index.js';

function loadEnvFiles() {
  const files = ['.env', '.env.local'];
  const loaded = [];

  files.forEach((f) => {
    const filePath = path.resolve(process.cwd(), f);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: true });
      loaded.push(f);
    }
  });

  return loaded;
}

async function main() {
  const loaded = loadEnvFiles();

  const logDir = path.resolve(process.cwd(), 'logs');
  const logger = createLogger({ logDir });

  logger.say('info', 'server', 'envLoaded', { files: loaded.join(', ') || '(nenhum)' });

  const HOST = process.env.HOST || '0.0.0.0';
  const PORT = Number(process.env.PORT || 4100);

  logger.say('info', 'server', 'starting', { host: HOST, port: PORT });

  const dataDir = path.resolve(process.cwd(), 'data');
  const sqlite = await openSqlite({
    dataDir,
    dbName: process.env.SQLITE_DB_NAME || 'digitacao',
    logger,
  });

  await ensureSchema({
    db: sqlite,
    schemaSqlPath: path.resolve(process.cwd(), 'src', 'sql', 'sqlite', 'schema.sql'),
    logger,
  });

  const mssqlPool = await connectMssql({ env: process.env, logger });

  const deps = { logger, sqlite, mssqlPool };

  const app = createApp(deps);

  app.listen(PORT, HOST, () => {
    logger.say('success', 'server', 'started', { host: HOST, port: PORT });
  });
}

main().catch((err) => {
  // ultimo recurso: nao usamos console no backend (apenas console.error em fatal)
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
