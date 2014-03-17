
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var http = require('http');
var path = require('path');
var uuid = require('node-uuid');

var WebSocketServer = require('ws').Server;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var clients = {};
var messages = new Array();
wss.on('connection', function(ws) {
  var userID = uuid.v1();
  clients[userID] = ws;

  console.log('client :' + userID + ' connected');
  
  for(var id in messages) {
        clients[userID].send(messages[id]);
  }

  ws.on('message', function(message) {
    message = JSON.parse(message);
    messages.push(JSON.stringify(message));
    console.log('received from ' + userID + ':' + message.name + " - " + message.msg);
    for (id in clients ) {
      clients[id].send(JSON.stringify(message));
    }

  });

  ws.on('close', function() {
    console.log('client :' + userID + ' closed connection');
    delete clients[userID];
  });
});