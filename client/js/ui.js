// aqui é o "boot" da nossa aplicação, onde são carregados os dados iniciais e atribuidos os eventos.

$(document).ready(function() {
  montaMenu();
  
  // ao carregar o documento, monta a tabela inicial
  atualizaLista(true);
  
  
  // $('body').on('novo-elemento-ajax', function() {
    // $(this).draggable();
  // })
  
  var compras = { produtos_selecionados: [] };
  
  $('#lista-produtos div input').attr('disabled', true);
  $('#lista-produtos div').draggable();
  
  $('#cesta-compras').droppable({
    drop: function(e, ui) {
      $(ui.draggable).css('background-color', 'red');
      // método 1: com inputs
      $(ui.draggable).find('input').attr('disabled', false);
      // método 2: com objeto JSON
      compras.produtos_selecionados.push( $(ui.draggable).data('id') );
    }
  });
  
  $('#cesta-compras').closest('form').submit(function(e) {
    console.log('JSON:', compras);
  })
  
  // $.ajax(..., function(data) {
    // $.each(data, function(i, d) {
      // var div = $('...');
      // $(div).trigger('novo-elemento-ajax');
    // })
  // });
  
  
  $("a[href$='#incr']").click(function(e) {
    e.preventDefault();
    var val = $('.progress-bar').attr('aria-valuenow');
    val = Number(val) + 10;
    $('.progress-bar').attr('aria-valuenow', val);
    $('.progress-bar').width(val + '%');
    // $('.progress-bar').css('width', val + '%');
    $('.progress-bar').find('span').text(val + '%');
  });
  
  
  
  
  
  
  
  
  
  
  // limpa o formulário, sempre que for reaberto
  $('#formulario').on('dialogopen', function() {
    var form = $(this).find('form');
    form.find('.btn').attr('disabled', false);
    form.find(':input').val('').attr('disabled', false);
    form.find('.resposta').removeClass('text-success text-danger').text('').hide();
  });
  
  $("[href$='#atualizar']").click(function(e) {
    e.preventDefault();
    atualizaLista();
  });
  
  $(".btn[href$='#adicionar']").click(function(e) {
    e.preventDefault();

    var dlg = $('#formulario')
    dlg.find('form').attr({ method: 'post', action: URL_BASE + '/contatos' });
    dlg.dialog({ title: 'Novo contato' });
  });
  
  $('#tabela-contatos').on('click', "a[href$='#editar']", function(e) {
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    var dlg = $('#formulario');
    var form = dlg['find']('form');
    form.attr({ method: 'patch', action: URL_BASE + '/contatos/' + id });
    carregaContato(id, function(c) {
      dlg.dialog({ title: 'Editando contato ' + c.nome });
      form.find(':input[name]').each(function() {
        var ctl = $(this);
        var v = c[ctl.attr('name')];
        if (v)
          ctl.val(v);
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

function montaMenu() {
  var menu = $('#menu');
  menu.load('menu.html', function() {
    $(this).find('.navbar-brand').text(menu.data('title'));
    $(this).find("a[href$='" + location.pathname + "']").addClass('active');
  });
}

function atualizaLista(primeiraVez) {
  carregaLista(function(dados) {
    var alvo = $('#tabela-contatos').find('tbody');
    
    // passo 1: remover o código que limpa o conteúdo
    // passo 2: ao percorrer os dados, verificar se já existe o TR com data-id igual ao id do registro
    // passo 3: adicionar código para tratar o caso de linha que já existe (alterar o conteúdo dos TDs)
    // passo 4: adicionar um efeito visual diferente quando altera e quando inclui a linha
    // passo 5: tratar caso adicional de exclusão
    
    // alvo.empty(); // limpa o conteúdo
    
    if (dados.length === 0) {
      alvo.append('<tr><td colspan="4"><em>Nenhum registro encontrado</td></tr>');
      return;
    }
    var v = new Date().getTime().toString();
    $.each(dados, function(i, registro) {
      // procura um TR com data-id igual ao do registro
      var tr = alvo.find('tr[data-id=' + registro.id + ']');
      if (tr.length > 0) {
        tr.data('v', v);
        // já existe, verifica se precisa alterar
        var alterado = tr.find('td:eq(0)').text() != registro.nome ||
                       tr.find('td:eq(1)').text() != registro.email ||
                       tr.find('td:eq(2)').text() != registro.telefone;
        if (alterado) {
          tr.find('td:eq(0)').text( registro.nome );
          tr.find('td:eq(1)').text( registro.email );
          tr.find('td:eq(2)').text( registro.telefone );
          tr.find('td').addClass('info').removeClass('info', 5000);
        }
      }
      else {
        // não existe, cria
        console.log('criando', registro);
        tr = $('<tr>', { 'data-id': registro.id, 'data-v': v });
        tr.append($('<td>', { text: registro.nome }));
        tr.append($('<td>', { text: registro.email }));
        tr.append($('<td>', { text: registro.telefone }));
        
        var acoes = $('<td>');
        acoes.append('<a href="#editar" class="btn btn-info btn-xs"><i class="glyphicon glyphicon-pencil"></i> Editar</a> ');
        acoes.append('<a href="#remover" class="btn btn-danger btn-xs"><i class="glyphicon glyphicon-trash"></i> Excluir</a> ');
        tr.append(acoes);
        alvo.append(tr);
        if (!primeiraVez)
          tr.find('td').addClass('success').removeClass('success', 5000);
      }
      
    });
    
    alvo.find('tr[data-v!=' + v + ']').fadeOut(1000, function() { $(this).remove(); });
  });
}