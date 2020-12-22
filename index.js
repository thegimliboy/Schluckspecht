var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


server.listen(3001, function() {
  console.log('Started 3001');
});

app.use(express.static(__dirname + '/'));


var players = [];

io.on('connection', (socket) => {

var socketuser;
  socket.on('username', (name) => {
    if (name === undefined || name === null) {} else {
      console.log(name+' connected; ID='+socket.id)
      io.emit('nachricht', name + '  connected');
      socketuser = name;
      players.push(name);
      io.emit('currOnline', players);
      console.log(players)
    }
  });


  socket.on('disconnect', () => {
    if (socketuser === undefined || socketuser === null) {} else {
      console.log(socketuser +' disconnected');
      io.emit('nachricht', socketuser + '  disconnected');
      const index = players.indexOf(socketuser);
      if (index > -1) {
      players.splice(index, 1);
      io.emit('currOnline', players);
      console.log(players)
      }
    }
  });

  socket.on('nachricht', (msg) => {
    io.emit('nachricht', socketuser+': '+msg);
    console.log('CHAT: ' + socketuser+': '+msg);
  });

  socket.on('gamecode', (room) => {
    //hier muss die ganze logic für den room-existence check hin
    console.log(io.sockets.adapter.rooms[room]);
    io.emit('gc_isavalible', '1');
  });

});
