
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var WebSocketServer = require('ws').Server;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  });
  }, 1000);

  console.log('websocket connection open');

  ws.on('close', function() {
    console.log('websocket connection close');
    clearInterval(id);
  });
});