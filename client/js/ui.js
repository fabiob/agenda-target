// aqui é o "boot" da nossa aplicação, onde são carregados os dados iniciais e atribuidos os eventos.

$(document).ready(function() {
  // ao carregar o documento, monta a tabela inicial
  atualizaLista();
  
  // limpa o formulário, sempre que for reaberto
  $('#formulario').on('dialogopen', function() {
    var form = $(this).find('form');
    form.find('.btn').attr('disabled', false);
    form.find(':input').val('').attr('disabled', false);
    form.find('.resposta').removeClass('text-success text-danger').text('').hide();
  });
  
  $(".btn[href$='#atualizar']").click(function(e) {
    e.preventDefault();
    atualizaLista();
  });
  
  $(".btn[href$='#adicionar']").click(function(e) {
    e.preventDefault();

    var dlg = $('#formulario')
    dlg.find('form').attr({ method: 'post', action: '/contatos' });
    dlg.dialog({ title: 'Novo contato' });
  });
  
  $('#tabela-contatos').on('click', "a[href$='#editar']", function(e) {
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    var dlg = $('#formulario');
    var form = dlg.find('form');
    form.attr({ method: 'patch', action: '/contatos/' + id });
    carregaContato(id, function(c) {
      dlg.dialog({ title: 'Editando contato' });
      form.find(':input[name]').each(function() {
        var ctl = $(this);
        var v = c[ctl.attr('name')];
        v && ctl.val(v);
      });
    });
  });
  
  $('#tabela-contatos').on('click', "a[href$='#remover']", function(e) {
    e.preventDefault();
    removeRegistro($(this).closest('tr').data('id'), function() {
      atualizaLista();
    });
  });

  $('body').on('submit', 'form.form-ajax', function(e) {
    e.preventDefault();
    
    var form = $(this);
    var resposta = form.find('.resposta').removeClass('alert-success alert-danger').hide();
    var dados = form.serialize();
    form.find(':input').attr('disabled', true)
    $.ajax(form.attr('action'), { method: form.attr('method'), data: dados })
      .done(function(r) {
        resposta.addClass('alert-success').text('Registro salvo com sucesso!').show();
        atualizaLista();
        setTimeout(function() {
          form.parent().dialog('close');
        }, 1500);
      })
      .fail(function(r) {
        var e = $.parseJSON(r.responseText);
        resposta.addClass('alert-danger').text('Erro ao salvar registro: ' + e.erro).show();
        form.find(':input').attr('disabled', false);
      });
  });
});

function atualizaLista() {
  carregaLista(function(dados) {
    var alvo = $('#tabela-contatos').find('tbody');
    alvo.empty(); // limpa o conteúdo
    
    if (dados.length === 0) {
      alvo.append('<tr><td colspan="4"><em>Nenhum registro encontrado</td></tr>');
      return;
    }
    $.each(dados, function(i, registro) {
      var tr = $('<tr>', { 'data-id': registro.id });
      tr.append($('<td>', { text: registro.nome }));
      tr.append($('<td>', { text: registro.email }));
      tr.append($('<td>', { text: registro.telefone }));
      
      var acoes = $('<td>');
      acoes.append('<a href="#editar" class="btn btn-info btn-xs"><i class="glyphicon glyphicon-pencil"></i> Editar</a> ');
      acoes.append('<a href="#remover" class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i> Excluir</a> ');
      tr.append(acoes);
      alvo.append(tr);
    });    
  });
}