// aqui vão as nossas funções e plugins

var URL_BASE = 'https://agenda-target-c9-fabiob.c9.io';

function carregaLista(callback) {
  $.getJSON(URL_BASE + '/contatos', function(dados) {
    callback(dados);
  });
}

function carregaContato(id, callback) {
  $.getJSON(URL_BASE + '/contatos/' + id)
    .done(function(c) {
      callback(c);
    });
}

function removeRegistro(id, callback) {
  $.ajax(URL_BASE + '/contatos/' + id, { method: 'delete' })
    .done(function() {
      callback();
    });
}