/* ARQUIVO: backend/src/repositories/sqlite/motivos.repo.js
 * RESPONSAVEL POR: Queries SQL (SQLite) para motivos
 * DEPENDENCIAS: db (sqlite)
 */

export function createMotivosRepo({ sqlite }) {
  return Object.freeze({
    async list({ search }) {
      const where = [];
      const params = {};

      if (search) {
        where.push('(codigo LIKE :search OR motivo LIKE :search)');
        params[':search'] = `%${search}%`;
      }

      const sql = `
        SELECT id, codigo, motivo, criado_em
        FROM motivos
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY codigo ASC
      `;

      return sqlite.all(sql, params);
    },

    async create({ codigo, motivo }) {
      const sql = `
        INSERT INTO motivos (codigo, motivo, criado_em)
        VALUES (:codigo, :motivo, datetime('now'))
      `;
      await sqlite.run(sql, { ':codigo': codigo, ':motivo': motivo });
      return sqlite.get('SELECT * FROM motivos WHERE id = last_insert_rowid()');
    },

    async update(id, { codigo, motivo }) {
      const current = await sqlite.get('SELECT * FROM motivos WHERE id = :id', { ':id': id });
      if (!current) return null;

      const next = {
        codigo: codigo ?? current.codigo,
        motivo: motivo ?? current.motivo,
      };

      const sql = `
        UPDATE motivos
        SET codigo = :codigo, motivo = :motivo
        WHERE id = :id
      `;
      await sqlite.run(sql, { ':id': id, ':codigo': next.codigo, ':motivo': next.motivo });

      return sqlite.get('SELECT * FROM motivos WHERE id = :id', { ':id': id });
    },

    async remove(id) {
      const current = await sqlite.get('SELECT * FROM motivos WHERE id = :id', { ':id': id });
      if (!current) return null;
      await sqlite.run('DELETE FROM motivos WHERE id = :id', { ':id': id });
      return { id };
    },
  });
}
