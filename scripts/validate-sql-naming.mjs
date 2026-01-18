/* ARQUIVO: scripts/validate-sql-naming.mjs
 * RESPONSAVEL POR: Validar naming SQL (SQLite) em portugues, sem acentos
 * DEPENDENCIAS: Node.js (fs, path)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const schemaPath = path.join(root, 'backend', 'src', 'sql', 'sqlite', 'schema.sql');
const content = fs.readFileSync(schemaPath, 'utf-8');

const errors = [];
const nameRegex = /^[a-z0-9_]+$/;

const lines = content.split(/\r?\n/);
let currentTable = null;

for (const line of lines) {
  const trimmed = line.trim();
  const tableMatch = trimmed.match(/^CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)/i);
  if (tableMatch) {
    currentTable = tableMatch[1];
    if (!nameRegex.test(currentTable)) {
      errors.push(`Tabela invalida: ${currentTable}`);
    }
    continue;
  }

  if (currentTable && trimmed.startsWith(')')) {
    currentTable = null;
    continue;
  }

  if (currentTable) {
    if (
      trimmed.startsWith('FOREIGN') ||
      trimmed.startsWith('PRIMARY') ||
      trimmed.startsWith('UNIQUE') ||
      trimmed.startsWith('CONSTRAINT')
    ) {
      continue;
    }

    const colMatch = trimmed.match(/^([a-zA-Z0-9_]+)/);
    if (colMatch) {
      const col = colMatch[1];
      if (!nameRegex.test(col)) {
        errors.push(`Coluna invalida (${currentTable}): ${col}`);
      }
    }
  }
}

if (errors.length) {
  // eslint-disable-next-line no-console
  console.error('[validate-sql-naming] Erros:');
  // eslint-disable-next-line no-console
  console.error(errors.join('\n'));
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log('[validate-sql-naming] OK');
