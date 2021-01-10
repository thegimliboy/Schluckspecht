//Test für Github
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const util = require('util');


server.listen(3001, function() {
  console.log('Started 3001');
});

app.use(express.static(__dirname + '/'));


var players = [];

/*
var testplayer = {
  username: "",
  room: ""
}
testplayer['testname'] = {username: 'wie der name schon sagt', room: 'nicht benannt'}
console.log('tp1: '+testplayer['testname'].username)


var room = {};
room['testraum'] = {rname: "Entwickler", players: ['jan','lala','kubi']}
room['testraum2'] = {rname: "Andere", players: ['1','2','3']}
var roomid = 'testraum2';
console.log('Spieler in '+ room[roomid].rname + ': '+room[roomid].players);
var lineid = 0;
//console.log('Spieler in '+ room[lineid].rname + ': '+room[lineid].players);
console.log(util.inspect(room));
*/
//hallo
//https://stackoverflow.com/questions/9422756/search-a-javascript-object-for-a-property-with-a-specific-value
function findprop (id, query) {
  for (var key in id) {
    var value = id[key];
    if (typeof value === 'object') {
      searchid(value, query);
    }
    if (value === query) {
      console.log('property=' + key + ' value=' + value);
    }
  }
};

function Room (rname) {
  this.rname=rname;
  this.player = {
	};
  this.addPlayer = function(sid,pname) {
	eval('this.player.id'+sid+'= new Player (sid,pname)');
  },this;
  this.removePlayer = function(sid) {
	eval('delete this.player.id'+sid);
  },this;
};

function Player (socketid, nickname) {
	this.sid=socketid;
	this.pname=nickname;
};

var testraum = new Room ('Adminraum');
testraum.addPlayer('0001','Jan');


io.on('connection', (socket) => {

  var socketuser;
  var id;

  socket.on('username', (name) => {
    if (name === undefined || name === null) {} else {
      console.log(name+' connected; ID='+socket.id);
      io.emit('nachricht', name + '  connected');
      socketuser = name;
//      players[socket.id]={username: name, room: ''};
      players.push(name);
      io.emit('currOnline', players);
      console.log('Players: '+players);
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
    eval('var room'+room+' = new Room (room)');
    id = socket.id;
    id = id.replace(/[^a-zA-Z ]/g, "");
//    console.log('Clean ID: '+id);
    eval('room'+room+'.addPlayer(id,socketuser)');
    socket.emit('your_room_is', room);
    eval("console.log('Inspect room: '+ util.inspect(room"+room+"))");
  });

  socket.on('joinroom', (room) => {
    socket.join(room);
    id = socket.id;
    id = id.replace(/[^a-zA-Z ]/g, "");
    console.log('Clean ID: '+id);
    eval('room'+room+'.addPlayer(id,socketuser)');
    socket.emit('your_room_is', room);
  });

});
