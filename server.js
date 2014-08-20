'use strict';

var http = require('http');
var path = require('path');

var express = require('express');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'bower_components')));
router.use(express.static(path.resolve(__dirname, 'client')));
router.use(express.logger('short'));
router.use(express.bodyParser());

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  
  next();
});

router.use(router.router);

var contatos = require('./contatos');

router.options('*', function(req, res) { res.send(200) })

router.get('/contatos', function(req, res) {
  res.json(contatos.lista());
});

router.get('/contatos/:id', function(req, res) {
  res.json(contatos.obtem(req.params['id']));
});

router.post('/contatos', function(req, res) {
  try {
    contatos.adiciona(req.body);
    res.json({ok: 1})
  } catch (e) {
    res.json({erro: e.message}, 500);
  }
});

router.patch('/contatos/:id', function(req, res) {
  try {
    contatos.atualiza(req.params['id'], req.body);
    res.json({ok: 1})
  } catch (e) {
    res.json({erro: e.message}, 500);
  }
});

router.delete('/contatos/:id', function(req, res) {
  contatos.remove(req.params['id']);
  res.json({ok: 1})
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Agenda rodando em", addr.address + ":" + addr.port);
});
