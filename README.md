<!-- ARQUIVO: README.md
RESPONSAVEL POR: Documentacao do projeto (padrao LINC)
DEPENDENCIAS: Markdown
-->

# Dig-Cad-Linc

Cadastro e digitacao de apontamentos de producao por linha, com:
- SQLite para armazenar dados locais (DB: `digitacao`)
- Consulta de OFs no Protheus (SQL Server) para autopreenchimento

<div style="position:fixed; top:16px; right:16px; border:1px solid #ddd; padding:12px 14px; background:#fff; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,.08); font-size:12px; z-index:9999;">
  <div><strong>Linc Indl. Coml. Tecidos Ltda.</strong></div>
  <div><strong>Eng. 2.6</strong> - Powered by <strong>Paulo</strong></div>
</div>

---

## Menu

- [Visao geral](#visao-geral)
- [Executando](#executando)
- [Portas automaticas](#portas-automaticas)
- [Variaveis de ambiente](#variaveis-de-ambiente)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Stack](#stack)
- [Padroes Eng aplicados](#padroes-eng-aplicados)

---

## Visao geral

- Tela **Digitacao**:
  - Seleciona **Linha**
  - Preenche campos de producao
  - Busca **OF** no Protheus (SC6010 + SA1010) e autopreenche: No OF, Item, Cod. Produto, Produto e Cliente
  - Calcula:
    - **Tempo** = Termino - Inicio
    - **Tempo Parada** = Parada Fim - Parada Inicio
    - **Gram. Media** = `(pesoLiquido / metros / largura) * 1000000` com formato `99,99`

- Tela **Pessoas**:
  - Cadastro de **Operador** e **Ajudante** (ou **Ambos**) para uso em dropdowns

---

## Executando

### 1) Instalar dependencias

Na raiz:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2) Rodar dev (backend + frontend)

```bash
npm run dev
```

O script `predev` escolhe portas livres automaticamente e gera:
- `backend/.env.local`
- `frontend/.env.local`

### 3) Checagens rapidas

```bash
npm run doctor
```

### 4) Validacoes

```bash
npm run validate
```

---

## Portas automaticas

- **Backend**: tenta a partir de **4100** (prefixo 41)
- **Frontend**: tenta a partir de **3100** (prefixo 31)

Para mudar a base (opcional):

```bash
BACKEND_PORT_BASE=4100 FRONTEND_PORT_BASE=3100 npm run dev
```

---

## Variaveis de ambiente

### Backend

- `backend/.env` (local)
- `backend/.env.local` (gerado)

Exemplos em `backend/.env.example`.

### Frontend

- `frontend/.env` (local)
- `frontend/.env.local` (gerado)

Exemplos em `frontend/.env.example`.

---

## Estrutura de pastas

```txt
backend/
  src/
    core/            # mensagens, logger, db, erros
    routes/          # rotas versionadas /api/v1
    controllers/
    services/
    repositories/
    middleware/
    pdf/
frontend/
  src/
    ui/              # mensagens e notifier centralizados
    pages/
    components/
    styles/
scripts/
```

---

## Stack

- Backend: Node.js + Express + SQLite + MSSQL (Protheus)
- Frontend: React + Vite + Router DOM + Context API
- Qualidade: ESLint + Prettier + EditorConfig
- Seguranca basica: helmet + cors, sem `x-powered-by`

---

## Padroes Eng aplicados

- Mensagens centralizadas (backend e frontend)
- Logger/notifier unificados (sem `console.log` no backend)
- Rotas → controllers → services → repositories
- Arquivos enxutos (<= 250 linhas) e funcoes (<= 50 linhas)
- Dockerfile + docker-compose
- Contratos de API com `ok`, `data`, `meta`, `traceId`
- Tokens de layout em `variables.css` + primitivas
- PDFs via HTML+CSS com tokens/presets
