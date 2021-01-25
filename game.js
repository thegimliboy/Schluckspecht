//var players = [];
var room = {};
$(function(){
  var username = getParameterByName('username');
  if (username.length < 2) {
    username = window.prompt('What is your Name?');
  }

  socket.emit('username', username);

  var gamecode = getParameterByName('gamecode');
  if (gamecode === null) {
    socket.emit('newroom');
    console.log('new room requested');
  }
  else {
    socket.emit('gamecode', gamecode);
    socket.on('gc_isavalible', function (boo) {
      if (boo === '1' ) {
        socket.emit('joinroom', gamecode);
        console.log('requested to join room '+gamecode)
      }
      else {window.alert('Gamecode nicht vergeben!')}
    });
  }

  socket.on('your_room_is', (room) => {
      gamecode = room;
      console.log('new room: '+room);
      document.getElementById('spieltitel').innerHTML = 'Schluckspecht: Das Spiel \t | Gamecode: '+room+' \t | Username: '+username;
  });


/*  socket.on('currOnline', function(currOnline) {
    players = currOnline;
    doOnlineL();
  });*/

  socket.on('update_room', newroom => {
    room = newroom;
    console.log('Recieved room obj update')
    doOnlineL();
  });

  $('form').submit(function(event){
    event.preventDefault();
    socket.emit('nachricht',$('#cn').val());
    $('#cn').val('');
    return false;
  });

  socket.on('nachricht', function(msg){
    $('#nachrichten').append($('<li>').text(msg));
  });
});

function doOnlineL () {
    $('#currOnline').empty();
    document.getElementById('currOnline').innerHTML =
    '<li>' + room.players.join('</li><li>') + '</li>'
};

function getParameterByName (name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


/*
var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");
ctx2.fillStyle = "blue";
ctx2.fillRect(0, 0, canvas2.width, canvas2.height);*/

var canvas1 = document.getElementById("Buttons");
var ctx1 = canvas1.getContext("2d");
ctx1.fillStyle = "red";
ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
