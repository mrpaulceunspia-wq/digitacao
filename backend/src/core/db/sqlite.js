/* 📁 ARQUIVO: backend/src/core/db/sqlite.js
 * 🧠 RESPONSÁVEL POR: Conexão SQLite + bootstrap do schema
 * 🔗 DEPENDÊNCIAS: sqlite, fs, path, MSG
 */

import fs from 'node:fs';
import path from 'node:path';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { MSG } from '../messages/index.js';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

export async function openSqlite({ dataDir, dbName, logger }) {
  ensureDir(dataDir);

  const file = path.join(dataDir, `${dbName}.sqlite`);
  const db = await open({
    filename: file,
    driver: sqlite3.Database,
  });

  logger.say('success', 'db', 'sqliteConnected', { file });
  return db;
}

export async function ensureSchema({ db, schemaSqlPath, logger }) {
  const schemaSql = fs.readFileSync(schemaSqlPath, 'utf-8');
  await db.exec(schemaSql);
  logger.say('success', 'db', 'sqliteSchemaReady');
  return true;
}
