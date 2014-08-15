'use strict';

var _ = require('lodash');
var crypto = require('crypto');

// Função utilitária para gerar um ID único.
// Geramos um de 24 bytes, contendo 8 bytes de timestamp e 16 bytes randômicos.
function novoId() {
  return Math.floor(new Date().getTime() / 1000).toString(16) +
    crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, 16);
};

// Essa é a nossa "camada de negócio" :)
// Possui todos os métodos CRUD, mas salvando os dados em memória ao invés do BD.

var dados = {};

function lista() {
  return _.values(dados);
}

function obtem(id) {
  return dados[id];
}

function adiciona(c) {
  if (!c)
    throw new Error("Não foi possível interpretar o novo registro.");
    
  if (!c.id)
    c.id = novoId();
  
  if (!c.telefone)
    throw new Error("Telefone é obrigatório.");

  dados[c.id] = c;
}

function remove(id) {
  delete dados[id];
}

function atualiza(id, c) {
  _.assign(dados[id], c);
}

// publica os métodos
exports.lista = lista;
exports.obtem = obtem;
exports.adiciona = adiciona;
exports.remove = remove;
exports.atualiza = atualiza;
