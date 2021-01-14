//Todo: Keine leeren Nachrichten abschicken

var players = [];
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
    socket.emit('joinroom', gamecode);
    console.log('requested to join room '+gamecode)
  }

  socket.on('your_room_is', (room) => {
      gamecode = room;
      console.log('new room: '+room);
      document.getElementById('spieltitel').innerHTML = 'Schluckspecht: Das Spiel \t | Gamecode: '+room;
  });


  socket.on('currOnline', function(currOnline) {
    players = currOnline;
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
  })
});

function doOnlineL () {
    $('#currOnline').empty();
    document.getElementById('currOnline').innerHTML =
    '<li>' + players.join('</li><li>') + '</li>'
};

function getParameterByName (name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
