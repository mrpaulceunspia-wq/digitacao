/* ARQUIVO: scripts/ports.mjs
 * RESPONSAVEL POR: Descobrir portas livres (backend comeca em 4100, frontend em 3100)
 * DEPENDENCIAS: Node.js (net, fs, path, os)
 */

import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isPortFree(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const srv = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => srv.close(() => resolve(true)))
      .listen(port, host);
  });
}

async function findFreePort(startPort, limit = 200) {
  for (let p = startPort; p < startPort + limit; p += 1) {
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(p);
    if (free) return p;
  }
  throw new Error(`Nenhuma porta livre encontrada a partir de ${startPort}`);
}

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const items = nets[name] || [];
    for (const item of items) {
      if (item && item.family === 'IPv4' && !item.internal) {
        return item.address;
      }
    }
  }
  return null;
}

function writeEnvLocal(filePath, lines) {
  const header = [
    '# ARQUIVO: .env.local',
    '# RESPONSAVEL POR: Gerado automaticamente por scripts/ports.mjs (NAO COMMITAR)',
    '# DEPENDENCIAS: Node.js',
    '',
  ].join('\n');

  fs.writeFileSync(filePath, `${header}${lines.join('\n')}\n`, 'utf-8');
}

async function main() {
  const backendBase = Number(process.env.BACKEND_PORT_BASE || 4100);
  const frontendBase = Number(process.env.FRONTEND_PORT_BASE || 3100);

  const backendPort = await findFreePort(backendBase, 300);
  const frontendPort = await findFreePort(frontendBase, 300);

  const backendEnvPath = path.join(__dirname, '..', 'backend', '.env.local');
  const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');

  writeEnvLocal(backendEnvPath, [
    'HOST=0.0.0.0',
    `PORT=${backendPort}`,
    '',
    '# SQLite',
    'SQLITE_DB_NAME=digitacao',
    '',
    '# SQL Server Protheus (pode sobrescrever via backend/.env)',
    'MSSQL_SERVER=192.168.0.2',
    'MSSQL_DATABASE=Protheus12',
    'MSSQL_USER=sa',
    'MSSQL_PASSWORD=Akld@99',
    'MSSQL_ENCRYPT=false',
  ]);

  writeEnvLocal(frontendEnvPath, [
    'VITE_HOST=0.0.0.0',
    `VITE_PORT=${frontendPort}`,
    '',
    '# Proxy do Vite para o backend local',
    `VITE_API_PROXY_TARGET=http://127.0.0.1:${backendPort}`,
  ]);

  const lanIp = getLanIp();
  const backendLocal = `http://127.0.0.1:${backendPort}`;
  const frontendLocal = `http://127.0.0.1:${frontendPort}`;
  const backendLan = lanIp ? `http://${lanIp}:${backendPort}` : null;
  const frontendLan = lanIp ? `http://${lanIp}:${frontendPort}` : null;

  // Feedback amigavel (permitido aqui porque e script de CLI, nao e backend)
  // eslint-disable-next-line no-console
  console.log(`[Dig-Cad-Linc] Portas selecionadas: backend=${backendPort} | frontend=${frontendPort}`);
  // eslint-disable-next-line no-console
  console.log(`[Dig-Cad-Linc] Backend: ${backendLocal}${backendLan ? ` | LAN: ${backendLan}` : ''}`);
  // eslint-disable-next-line no-console
  console.log(`[Dig-Cad-Linc] Frontend: ${frontendLocal}${frontendLan ? ` | LAN: ${frontendLan}` : ''}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[Dig-Cad-Linc] Erro ao selecionar portas:', err.message);
  process.exit(1);
});
