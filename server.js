var express = require('express');
g var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const util = require('util')


server.listen(3001, function() {
  console.log('Started 3001');
});

app.use(express.static(__dirname + '/'));


var players = [];
var testplayer = {
  username: "",
  room: ""
}
testplayer['hurensohn'] = {username: 'wie der name schon sagt', room: 'zimmer deiner mum'}
console.log('tp: '+testplayer['hurensohn'].username)

io.on('connection', (socket) => {

var socketuser;
  socket.on('username', (name) => {
    if (name === undefined || name === null) {} else {
      console.log(name+' connected; ID='+socket.id)
      io.emit('nachricht', name + '  connected');
      socketuser = name;
//      players[socket.id]={username: name, room: ''};
      players.push(name);
      io.emit('currOnline', players);
      console.log('Players: '+players)
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
    console.log('--------------------------------------------------------------------------------------------------------')
    console.log('Inspect socket: '+util.inspect(socket.adapter))
    console.log(players)
    console.log('--------------------------------------------------------------------------------------------------------')
  });

  socket.on('gamecode', (gc) => {
    var room = socket.adapter.rooms[gc];

//        console.log(util.inspect(room));
    if (room === undefined ) {io.emit('gc_isavalible', '0');} else {
      io.emit('gc_isavalible', '1');
    }
  });

  socket.on('newroom',() => {
    function getRandomInt(max) {return Math.floor(Math.random() * Math.floor(max));}
    room = getRandomInt(100000);
    socket.join(room);
    socket.emit('your_room_is', room);
  });

  socket.on('joinroom', (room) => {
    socket.join(room);
    socket.emit('your_room_is', room);
  });

});
