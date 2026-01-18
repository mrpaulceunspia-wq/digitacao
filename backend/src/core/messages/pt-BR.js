/* 📁 ARQUIVO: backend/src/core/messages/pt-BR.js
 * 🧠 RESPONSÁVEL POR: Catálogo principal de mensagens (pt-BR)
 * 🔗 DEPENDÊNCIAS: Nenhuma
 */

export const PT_BR = Object.freeze({
  general: {
    ok: 'OK',
    created: 'Criado com sucesso.',
    updated: 'Atualizado com sucesso.',
    deleted: 'Removido com sucesso.',
    notFound: 'Recurso não encontrado.',
  },
  server: {
    starting: 'Iniciando servidor em ${host}:${port}…',
    started: 'Servidor pronto em ${host}:${port}.',
    envLoaded: 'Variáveis carregadas (${files}).',
  },
  validation: {
    required: 'Campo obrigatório: ${field}.',
    invalid: 'Valor inválido em ${field}.',
    timeNegative: 'Hora final menor que a inicial em ${field}. Verifique os horários.',
    gramCalcInvalid: 'Não foi possível calcular Gram. Média. Verifique peso, metros e largura.',
    paginationInvalid: 'Parâmetros de paginação inválidos.',
  },
  db: {
    sqliteConnected: 'SQLite conectado (${file}).',
    sqliteSchemaReady: 'SQLite schema pronto.',
    mssqlConnected: 'SQL Server conectado (${server}/${database}).',
    mssqlDisabled: 'SQL Server desabilitado (variáveis ausentes).',
  },
  people: {
    listOk: 'Lista de pessoas carregada.',
    created: 'Pessoa cadastrada.',
    updated: 'Pessoa atualizada.',
    disabled: 'Pessoa desativada.',
  },
  digitacao: {
    listOk: 'Lista de digitações carregada.',
    created: 'Digitação registrada.',
    updated: 'Digitação atualizada.',
    deleted: 'Digitação removida.',
  },
  protheus: {
    ofsOk: 'OFs encontradas: ${count}.',
    ofsNone: 'Nenhuma OF encontrada para o número informado.',
    queryError: 'Falha ao consultar OFs no Protheus.',
  },
});
