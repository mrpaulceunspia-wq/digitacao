/* ARQUIVO: scripts/doctor.mjs
 * RESPONSAVEL POR: Checagens rapidas antes de rodar o projeto
 * DEPENDENCIAS: Node.js (child_process)
 */

import { spawnSync } from 'node:child_process';

function run(label, cmd, args = []) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  if (res.status !== 0) {
    throw new Error(`Falha em ${label}`);
  }
}

try {
  run('validate-messages', 'node', ['scripts/validate-messages.mjs']);
  run('validate-sql-naming', 'node', ['scripts/validate-sql-naming.mjs']);
  // eslint-disable-next-line no-console
  console.log('[Doctor] OK');
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[Doctor] Falha:', err.message);
  process.exit(1);
}
