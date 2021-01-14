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
  this.player = {};
  this.players  = [];
  this.addPlayer = function(sid,pname) {
	  eval('this.player.id'+sid+'= new Player (sid,pname)');
    this.players.push(pname);
    console.log('Ausgabe nach add to players: '+this.players);
  },this;
  this.removePlayer = function(sid) {
    eval("pname = this.player.id"+sid+".pname");
	  eval('delete this.player.id'+sid);
    const index = this.players.indexOf(pname);
    if (index > -1) {
      this.players.splice(index, 1);
    };
    console.log('Ausgabe nach remove from players: '+this.players);
  },this;
};

function Player (socketid, nickname) {
	this.sid=socketid;
	this.pname=nickname;
};

function checkRoom (gc) {
  var result;
  eval("if (rooms.room"+gc+" == undefined) {result = 0;} else {result = 1;}");
  return result
};

//Vielleicht unnötig
function msg_to_room (room, topic, msg) {
      eval("io.to(room).emit(topic, msg)");
};

var rooms = {};

io.on('connection', (socket) => {

  var socketuser;
  var id;
  var room;

  socket.on('username', (name) => {
    if (name === undefined || name === null) {} else {
      console.log(name+' connected; ID='+socket.id);

      //io.emit('nachricht', name + '  connected');
      socketuser = name;
//      players[socket.id]={username: name, room: ''};
//      players.push(name);
      //io.emit('currOnline', players);

//      console.log('Players: '+players);
    }
  });


  socket.on('disconnect', () => {
    if (socketuser === undefined || socketuser === null) {} else {
      console.log(socketuser +' disconnected');
//      io.emit('nachricht', socketuser + '  disconnected');
/*      const index = players.indexOf(socketuser);
      if (index > -1) {
      players.splice(index, 1);
    }*/
      if (checkRoom(room)===1){
        eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+' disconnected')");
        eval('rooms.room'+room+'.removePlayer(id)');
        eval("io.to(room).emit('currOnline', rooms.room"+room+".players)");
      };
//      io.emit('currOnline', players);
//      console.log(players)


    }
  });

  socket.on('nachricht', (msg) => {
    eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+': '+msg)");
//      eval("io.to(room).emit('nachricht', room)");
      console.log('Chat in '+room+': '+socketuser+': '+msg);
    //io.emit('nachricht', socketuser+': '+msg);
/*console.log('--------------------------------------------------------------------------------------------------------')
console.log('Inspect socket: '+util.inspect(socket.adapter.sids))
console.log('--------------------------------------------------------------------------------------------------------')*/
  });

  socket.on('gamecode', (gc) => {
    var gc_exists;
    eval("if (rooms.room"+gc+" == undefined) {} else {gc_exists = 1}");
    if (gc_exists === undefined ) {io.emit('gc_isavalible', '0');} else {
      io.emit('gc_isavalible', '1');
    }
  });

  socket.on('newroom',() => {
    function getRandomInt(max) {return Math.floor(Math.random() * Math.floor(max));}
    room = getRandomInt(100000);
    room = room + '';
    socket.join(room);
    //eval("socket.join('"+room+"')");
    eval('rooms.room'+room+' = new Room (room)');
    id = socket.id;
    id = id.replace(/[^a-zA-Z ]/g, "");
//    console.log('Clean ID: '+id);
    eval('rooms.room'+room+'.addPlayer(id,socketuser)');
    socket.emit('your_room_is', room);
//    eval("console.log('Inspect room: '+ util.inspect(rooms.room"+room+"))");
    eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+' connected')");
    eval("io.to(room).emit('currOnline', rooms.room"+room+".players)");
  });

  socket.on('joinroom', (jroom) => {
    room = jroom;
    //eval("socket.join('"+room+"')");
    socket.join(room);
    id = socket.id;
    id = id.replace(/[^a-zA-Z ]/g, "");
//    console.log('Clean ID: '+id);
    if (checkRoom(room) === 1) {
      eval('rooms.room'+room+'.addPlayer(id,socketuser)');
      eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+' connected')");
//      eval("console.log('Inspect room: '+ util.inspect(rooms.room"+room+"))");
      eval("io.to(room).emit('currOnline', rooms.room"+room+".players)");
    };
    socket.emit('your_room_is', room);

  });

});
