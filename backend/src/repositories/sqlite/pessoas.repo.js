/* 📁 ARQUIVO: backend/src/repositories/sqlite/pessoas.repo.js
 * 🧠 RESPONSÁVEL POR: Queries SQL (SQLite) para pessoas
 * 🔗 DEPENDÊNCIAS: db (sqlite)
 */

export function createPessoasRepo({ sqlite }) {
  return Object.freeze({
    async list({ tipos, search, ativo }) {
      const where = [];
      const params = {};

      if (typeof ativo === 'number') {
        where.push('ativo = :ativo');
        params[':ativo'] = ativo;
      }

      if (tipos?.length) {
        where.push(`tipo IN (${tipos.map((_, i) => `:t${i}`).join(', ')})`);
        tipos.forEach((t, i) => {
          params[`:t${i}`] = t;
        });
      }

      if (search) {
        where.push('nome LIKE :search');
        params[':search'] = `%${search}%`;
      }

      const sql = `
        SELECT id, nome, tipo, ativo, criado_em
        FROM pessoas
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY nome ASC
      `;

      const rows = await sqlite.all(sql, params);
      return rows;
    },

    async create({ nome, tipo }) {
      const sql = `
        INSERT INTO pessoas (nome, tipo, ativo, criado_em)
        VALUES (:nome, :tipo, 1, datetime('now'))
      `;
      await sqlite.run(sql, { ':nome': nome, ':tipo': tipo });

      const row = await sqlite.get('SELECT * FROM pessoas WHERE id = last_insert_rowid()');
      return row;
    },

    async update(id, { nome, tipo, ativo }) {
      const current = await sqlite.get('SELECT * FROM pessoas WHERE id = :id', { ':id': id });
      if (!current) return null;

      const next = {
        nome: nome ?? current.nome,
        tipo: tipo ?? current.tipo,
        ativo: ativo ?? current.ativo,
      };

      const sql = `
        UPDATE pessoas
        SET nome = :nome, tipo = :tipo, ativo = :ativo
        WHERE id = :id
      `;
      await sqlite.run(sql, { ':id': id, ':nome': next.nome, ':tipo': next.tipo, ':ativo': next.ativo });

      return sqlite.get('SELECT * FROM pessoas WHERE id = :id', { ':id': id });
    },

    async disable(id) {
      const current = await sqlite.get('SELECT * FROM pessoas WHERE id = :id', { ':id': id });
      if (!current) return null;

      await sqlite.run('UPDATE pessoas SET ativo = 0 WHERE id = :id', { ':id': id });
      return sqlite.get('SELECT * FROM pessoas WHERE id = :id', { ':id': id });
    },
  });
}
