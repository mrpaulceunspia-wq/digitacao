-- 📁 ARQUIVO: backend/src/sql/sqlite/schema.sql
-- 🧠 RESPONSÁVEL POR: Schema SQLite do projeto (DB: digitacao)
-- 🔗 DEPENDÊNCIAS: SQLite

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pessoas (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  tipo      TEXT NOT NULL CHECK (tipo IN ('OPERADOR','AJUDANTE','AMBOS')),
  ativo     INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS motivos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo    TEXT NOT NULL UNIQUE,
  motivo    TEXT NOT NULL,
  criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS digitacoes (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,

  linha             INTEGER NOT NULL,
  data              TEXT NOT NULL,
  turno             TEXT NOT NULL,

  operador_id        INTEGER NOT NULL,
  ajudante_id        INTEGER,

  of_numero          TEXT NOT NULL,
  of_item            TEXT NOT NULL,
  cod_produto        TEXT NOT NULL,
  produto            TEXT NOT NULL,
  cliente            TEXT,

  num_bobina         TEXT,
  peso_liquido       REAL,
  metros             REAL,
  largura            REAL,
  gram_media         REAL,

  inicio             TEXT,
  termino            TEXT,
  tempo_min          INTEGER,

  tipo_fibra         TEXT CHECK (tipo_fibra IN ('F1','F2','F4','F5','F6')),
  num_rolinhos       INTEGER,
  peso               REAL,

  cola_numero        TEXT,
  cola_carga         TEXT,
  peso_refugo        REAL,
  aprovado           INTEGER CHECK (aprovado IN (0,1)),

  parada_inicio      TEXT,
  parada_fim         TEXT,
  tempo_parada_min   INTEGER,
  motivo             TEXT,

  observacoes        TEXT,

  criado_em          TEXT NOT NULL,
  atualizado_em      TEXT NOT NULL,

  FOREIGN KEY (operador_id) REFERENCES pessoas(id),
  FOREIGN KEY (ajudante_id) REFERENCES pessoas(id)
);

CREATE INDEX IF NOT EXISTS idx_digitacoes_data ON digitacoes (data);
CREATE INDEX IF NOT EXISTS idx_digitacoes_linha ON digitacoes (linha);
CREATE INDEX IF NOT EXISTS idx_motivos_codigo ON motivos (codigo);
