$(function() {

  $('#name').val(localStorage.getItem('chatty_name'));
  $('#room').val(localStorage.getItem('chatty_room'));

  var host = location.origin.replace(/^http/, 'ws')
  var ws = new WebSocket(host);
  ws.onmessage = function (event) {
    
    var roomname = $('#room').val();
    var data = JSON.parse(event.data);
    console.log(data);
    var name = data.name;
    var msg = data.msg;
    var room = data.room;
    if(roomname === room) {
      var room_span = $('<span></span>').addClass('room').html(room);
      var name_span = $('<span></span>').addClass('name').html(name);
      var msg_div = $('<div></div>').html(room_span).append(name_span).append(msg);

      $('#chatLog').prepend(msg_div);
    }
  };

  var onEnter = function() {
    var name = $('#name').val();
    var $message = $('#message');
    var msg = $message.val();
    var room = $('#room').val();

    localStorage.setItem('chatty_name',name);
    localStorage.setItem('chatty_room',room);

    console.log('sending: ' + name + ": " + msg);

    ws.send(JSON.stringify({ name: name, msg: msg, room: room}));
    $message.val('');

  }

  $('#submit').on('click', onEnter);
  // register Enter event
  $('#message').keypress(function(event) {
      if (event.keyCode === 13) {
          onEnter();
      }
  });

});