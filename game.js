//var players = [];
//roll-button taucht erst auf wenn das gema ready ist
//Bereit button verschwindet wenn das Spiel gestartet ist
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

  socket.on('your_room_is', (gameroom) => {
      gamecode = gameroom;
      console.log('new room: '+gameroom);
      document.getElementById('spieltitel').innerHTML = 'Schluckspecht: Das Spiel \t | Gamecode: '+gameroom+' \t | Username: '+username;
  });

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

  socket.on('yourTurn', function(){
    document.getElementById('roll').style.visibility = 'visible';
  });

  socket.on('gamestart', () =>{
    console.log("Game started");
    document.getElementById('setReady').style.visibility = 'hidden';
    for (var i=1;i<26;i++){
      if (i < 10) {eval("feld = document.getElementById('canvas0"+i+"')");} else {eval("feld = document.getElementById('canvas"+i+"')");};
      //feld = document.getElementById('canvas01')
      var ctx = feld.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillText(i, 10, 50);
    }
  });
});

function ready () {
  socket.emit('ready');
};

function roll () {
  socket.emit('roll');
  //document.getElementById('roll').style.visibility = 'hidden'; //Wird wieder sichtbar durch sowas wie socket.on('yourTurn')
};

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

var canvas1 = document.getElementById("Buttons");
var ctx1 = canvas1.getContext("2d");
ctx1.fillStyle = "red";
ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
