/* ARQUIVO: scripts/validate-messages.mjs
 * RESPONSAVEL POR: Validar chaves de mensagens e texto literal em JSX
 * DEPENDENCIAS: Node.js (fs, path, url)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function walk(dir, predicate) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      files.push(...walk(full, predicate));
    } else if (predicate(full)) {
      files.push(full);
    }
  }
  return files;
}

function extractMsgGets(content) {
  const results = [];
  const regex = /MSG\.get\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({ category: match[1], key: match[2] });
  }
  return results;
}

function collectCatalog(filePath) {
  return import(pathToFileURL(filePath).href).then((mod) => {
    const catalog = mod.PT_BR || mod.default;
    if (!catalog) throw new Error(`Catalogo nao encontrado em ${filePath}`);
    return catalog;
  });
}

function hasLiteralJsxText(content) {
  const regex = />[^<{]*[A-Za-z0-9][^<]*</g;
  return regex.test(content);
}

async function main() {
  const backendCatalog = await collectCatalog(
    path.join(root, 'backend', 'src', 'core', 'messages', 'pt-BR.js'),
  );
  const frontendCatalog = await collectCatalog(
    path.join(root, 'frontend', 'src', 'ui', 'messages', 'pt-BR.js'),
  );

  const backendFiles = walk(path.join(root, 'backend', 'src'), (p) => p.endsWith('.js'));
  const frontendFiles = walk(path.join(root, 'frontend', 'src'), (p) => p.endsWith('.js') || p.endsWith('.jsx'));

  const missing = [];
  for (const file of backendFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    extractMsgGets(content).forEach(({ category, key }) => {
      if (!backendCatalog[category] || backendCatalog[category][key] === undefined) {
        missing.push(`${file}: ${category}.${key}`);
      }
    });
  }

  for (const file of frontendFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    extractMsgGets(content).forEach(({ category, key }) => {
      if (!frontendCatalog[category] || frontendCatalog[category][key] === undefined) {
        missing.push(`${file}: ${category}.${key}`);
      }
    });
  }

  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error('[validate-messages] Chaves ausentes:');
    // eslint-disable-next-line no-console
    console.error(missing.join('\n'));
    process.exit(1);
  }

  const jsxViolations = [];
  for (const file of frontendFiles.filter((p) => p.endsWith('.jsx'))) {
    const content = fs.readFileSync(file, 'utf-8');
    if (hasLiteralJsxText(content)) {
      jsxViolations.push(file);
    }
  }

  if (jsxViolations.length) {
    // eslint-disable-next-line no-console
    console.error('[validate-messages] Texto literal em JSX detectado:');
    // eslint-disable-next-line no-console
    console.error(jsxViolations.join('\n'));
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('[validate-messages] OK');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[validate-messages] Erro:', err.message);
  process.exit(1);
});
