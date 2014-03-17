$(function() {

  var host = location.origin.replace(/^http/, 'ws')
  var ws = new WebSocket(host);
  ws.onmessage = function (event) {

    var data = JSON.parse(event.data);
    console.log(data);
    var name = data.name;
    var msg = data.msg;
    var name_span = $('<span></span>').addClass('name').html(name);
    var msg_div = $('<div></div>').html(name_span).append(msg);

    $('#chatLog').append(msg_div);

  };

  $('#submit').on('click', function() {
    var name = $('#name').val();
    var $message = $('#message');
    var msg = $message.val();

    console.log('sending: ' + name + ": " + msg);

    ws.send(JSON.stringify({ name: name, msg: msg}));
    $message.val('');

  });

});