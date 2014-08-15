// aqui vão as nossas funções e plugins

function carregaLista(callback) {
  $.getJSON('/contatos', function(dados) {
    console.log(dados);
    callback(dados);
  });
}

function carregaContato(id, callback) {
  $.getJSON('/contatos/' + id)
    .done(function(c) {
      callback(c);
    });
}

function removeRegistro(id, callback) {
  $.ajax('/contatos/' + id, { method: 'delete' })
    .done(function() {
      callback();
    });
}