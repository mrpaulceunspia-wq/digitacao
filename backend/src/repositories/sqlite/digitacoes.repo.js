/* 📁 ARQUIVO: backend/src/repositories/sqlite/digitacoes.repo.js
 * 🧠 RESPONSÁVEL POR: Queries SQL (SQLite) para digitações
 * 🔗 DEPENDÊNCIAS: db (sqlite)
 */

const ALLOWED_SORT = new Set(['id', 'data', 'linha', 'criado_em']);

function safeSort(sort) {
  if (!sort) return 'criado_em';
  return ALLOWED_SORT.has(sort) ? sort : 'criado_em';
}

function safeOrder(order) {
  if (!order) return 'DESC';
  return String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
}

export function createDigitacoesRepo({ sqlite }) {
  return Object.freeze({
    async list({ query, pagination }) {
      const where = ['1=1'];
      const params = {};

      if (query.linha) {
        where.push('linha = :linha');
        params[':linha'] = query.linha;
      }
      if (query.numBobina) {
        where.push('num_bobina = :numBobina');
        params[':numBobina'] = query.numBobina;
      }
      if (query.ofNumero) {
        where.push('of_numero = :ofNumero');
        params[':ofNumero'] = query.ofNumero;
      }
      if (query.ofItem) {
        where.push('of_item = :ofItem');
        params[':ofItem'] = query.ofItem;
      }
      if (query.dataDe) {
        where.push('data >= :dataDe');
        params[':dataDe'] = query.dataDe;
      }
      if (query.dataAte) {
        where.push('data <= :dataAte');
        params[':dataAte'] = query.dataAte;
      }

      const sort = safeSort(query.sort);
      const order = safeOrder(query.order);

      const countSql = `SELECT COUNT(1) as total FROM digitacoes WHERE ${where.join(' AND ')}`;
      const { total } = await sqlite.get(countSql, params);

      const rowsSql = `
        SELECT
          d.*,
          op.nome as operador_nome,
          aj.nome as ajudante_nome
        FROM digitacoes d
        LEFT JOIN pessoas op ON op.id = d.operador_id
        LEFT JOIN pessoas aj ON aj.id = d.ajudante_id
        WHERE ${where.join(' AND ')}
        ORDER BY ${sort} ${order}
        LIMIT :limit OFFSET :offset
      `;

      const rows = await sqlite.all(rowsSql, {
        ...params,
        ':limit': pagination.limit,
        ':offset': pagination.offset,
      });

      return {
        items: rows,
        page: pagination.page,
        pageSize: pagination.pageSize,
        total,
      };
    },

    async getById(id) {
      return sqlite.get(
        `
        SELECT
          d.*,
          op.nome as operador_nome,
          aj.nome as ajudante_nome
        FROM digitacoes d
        LEFT JOIN pessoas op ON op.id = d.operador_id
        LEFT JOIN pessoas aj ON aj.id = d.ajudante_id
        WHERE d.id = :id
      `,
        { ':id': id },
      );
    },

    async create(p) {
      const sql = `
        INSERT INTO digitacoes (
          linha, data, turno, operador_id, ajudante_id,
          of_numero, of_item, cod_produto, produto, cliente,
          num_bobina, peso_liquido, metros, largura, gram_media,
          inicio, termino, tempo_min,
          tipo_fibra, num_rolinhos, peso,
          cola_numero, cola_carga, peso_refugo, aprovado,
          parada_inicio, parada_fim, tempo_parada_min, motivo,
          observacoes,
          criado_em, atualizado_em
        ) VALUES (
          :linha, :data, :turno, :operador_id, :ajudante_id,
          :of_numero, :of_item, :cod_produto, :produto, :cliente,
          :num_bobina, :peso_liquido, :metros, :largura, :gram_media,
          :inicio, :termino, :tempo_min,
          :tipo_fibra, :num_rolinhos, :peso,
          :cola_numero, :cola_carga, :peso_refugo, :aprovado,
          :parada_inicio, :parada_fim, :tempo_parada_min, :motivo,
          :observacoes,
          datetime('now'), datetime('now')
        )
      `;

      await sqlite.run(sql, {
        ':linha': p.linha,
        ':data': p.data,
        ':turno': p.turno,
        ':operador_id': p.operadorId,
        ':ajudante_id': p.ajudanteId ?? null,

        ':of_numero': p.ofNumero,
        ':of_item': p.ofItem,
        ':cod_produto': p.codProduto,
        ':produto': p.produto,
        ':cliente': p.cliente ?? null,

        ':num_bobina': p.numBobina ?? null,
        ':peso_liquido': p.pesoLiquido ?? null,
        ':metros': p.metros ?? null,
        ':largura': p.largura ?? null,
        ':gram_media': p.gramMedia ?? null,

        ':inicio': p.inicio ?? null,
        ':termino': p.termino ?? null,
        ':tempo_min': p.tempoMin ?? null,

        ':tipo_fibra': p.tipoFibra ?? null,
        ':num_rolinhos': p.numRolinhos ?? null,
        ':peso': p.peso ?? null,

        ':cola_numero': p.colaNumero ?? null,
        ':cola_carga': p.colaCarga ?? null,
        ':peso_refugo': p.pesoRefugo ?? null,
        ':aprovado': p.aprovado ?? null,

        ':parada_inicio': p.paradaInicio ?? null,
        ':parada_fim': p.paradaFim ?? null,
        ':tempo_parada_min': p.tempoParadaMin ?? null,
        ':motivo': p.motivo ?? null,

        ':observacoes': p.observacoes ?? null,
      });

      return sqlite.get('SELECT * FROM digitacoes WHERE id = last_insert_rowid()');
    },

    async update(id, p) {
      const current = await sqlite.get('SELECT id FROM digitacoes WHERE id = :id', { ':id': id });
      if (!current) return null;

      const sql = `
        UPDATE digitacoes SET
          linha = :linha, data = :data, turno = :turno, operador_id = :operador_id, ajudante_id = :ajudante_id,
          of_numero = :of_numero, of_item = :of_item, cod_produto = :cod_produto, produto = :produto, cliente = :cliente,
          num_bobina = :num_bobina, peso_liquido = :peso_liquido, metros = :metros, largura = :largura, gram_media = :gram_media,
          inicio = :inicio, termino = :termino, tempo_min = :tempo_min,
          tipo_fibra = :tipo_fibra, num_rolinhos = :num_rolinhos, peso = :peso,
          cola_numero = :cola_numero, cola_carga = :cola_carga, peso_refugo = :peso_refugo, aprovado = :aprovado,
          parada_inicio = :parada_inicio, parada_fim = :parada_fim, tempo_parada_min = :tempo_parada_min, motivo = :motivo,
          observacoes = :observacoes,
          atualizado_em = datetime('now')
        WHERE id = :id
      `;

      await sqlite.run(sql, {
        ':id': id,

        ':linha': p.linha,
        ':data': p.data,
        ':turno': p.turno,
        ':operador_id': p.operadorId,
        ':ajudante_id': p.ajudanteId ?? null,

        ':of_numero': p.ofNumero,
        ':of_item': p.ofItem,
        ':cod_produto': p.codProduto,
        ':produto': p.produto,
        ':cliente': p.cliente ?? null,

        ':num_bobina': p.numBobina ?? null,
        ':peso_liquido': p.pesoLiquido ?? null,
        ':metros': p.metros ?? null,
        ':largura': p.largura ?? null,
        ':gram_media': p.gramMedia ?? null,

        ':inicio': p.inicio ?? null,
        ':termino': p.termino ?? null,
        ':tempo_min': p.tempoMin ?? null,

        ':tipo_fibra': p.tipoFibra ?? null,
        ':num_rolinhos': p.numRolinhos ?? null,
        ':peso': p.peso ?? null,

        ':cola_numero': p.colaNumero ?? null,
        ':cola_carga': p.colaCarga ?? null,
        ':peso_refugo': p.pesoRefugo ?? null,
        ':aprovado': p.aprovado ?? null,

        ':parada_inicio': p.paradaInicio ?? null,
        ':parada_fim': p.paradaFim ?? null,
        ':tempo_parada_min': p.tempoParadaMin ?? null,
        ':motivo': p.motivo ?? null,

        ':observacoes': p.observacoes ?? null,
      });

      return sqlite.get('SELECT * FROM digitacoes WHERE id = :id', { ':id': id });
    },

    async remove(id) {
      const current = await sqlite.get('SELECT id FROM digitacoes WHERE id = :id', { ':id': id });
      if (!current) return null;

      await sqlite.run('DELETE FROM digitacoes WHERE id = :id', { ':id': id });
      return { id };
    },
  });
}
