/* 📁 ARQUIVO: backend/src/core/logger/logger.js
 * 🧠 RESPONSÁVEL POR: Logger unificado (info, warn, error, success) em logs/app.log
 * 🔗 DEPENDÊNCIAS: fs, path, MSG
 */

import fs from 'node:fs';
import path from 'node:path';

import { MSG } from '../messages/index.js';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function formatLine(level, message) {
  return `[${nowIso()}] [${level.toUpperCase()}] ${message}\n`;
}

export function createLogger({ logDir }) {
  ensureDir(logDir);
  const file = path.join(logDir, 'app.log');

  function write(level, message) {
    fs.appendFileSync(file, formatLine(level, message), 'utf-8');
  }

  return Object.freeze({
    info(message) {
      write('info', message);
    },
    warn(message) {
      write('warn', message);
    },
    error(message) {
      write('error', message);
    },
    success(message) {
      write('success', message);
    },
    say(level, cat, key, params) {
      const message = MSG.get(cat, key, params);
      write(level, message);
    },
  });
}
