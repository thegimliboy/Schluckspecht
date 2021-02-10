//Inspiration: Picolo und Saufen.io
//Todo: Gameroom Admin, welcher this.players[1] ist.
//Todo: Kick User
//Todo: Keine Doppelten Usernames IN EINEM RAUM
//Todo: Gamcode <10000  &  >100000
//FELDER OBJECT, darin einzelne Feld objecte: Canvasid, Feldnummer, Kategorie, Frage wird jedes mal auf Server zufällig ausgewählt
//Regel, Liste mit Regel, Regeln begrenz auf Runden (neue function "nextround()"), window.promt wenn regel abgelaufen
//Was wenn ein Spieler erst später reinjoined? Was wenn ein Spieler während des Spieles verlässt?
//SSL Verschlüsselung
//Warnung wenn man game.js während spiel schließt
//Schluckspecht Logo anklickbar machen
//Schluckspecht Logo in join.html
//Wenn alle den Raum verlassen haben, dann lösch ihn
//Nach würfeln "gemacht"-Knopf, damit der nächste Würfeln kann
//Dynamische Feldgröße. Host kann Feldmaße selbst bestimmen durch parameter, die dann mit for-Schleifen die Canvastabellen erstellen
//In Aufgaben.js Index[0]=Kategoriename, getRandomInt+1

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var getExcercise = require('./aufgaben');
const util = require('util');

server.listen(3001, function() {
  console.log('Started 3001');
});

app.use(express.static(__dirname + '/static'));

//https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random
function getRandomInt(max) {return Math.floor(Math.random() * Math.floor(max));}

//https://stackoverflow.com/questions/45796948/search-a-deeply-nested-value-in-array-of-objects-in-javascript
function playerIDbyindex (obj, query) {
    for (var currProp in obj) {
        var value = obj[currProp].pname;
        if (typeof value === 'object') {
            playerIDbyindex(value, query);
        }
        if (value === query) {
            return(currProp);
        }
    }
}

function Room (rname) {
  this.rname=rname;
  this.player = {};
  this.players  = [];
  this.addPlayer = function(sid,pname) {
	  eval('this.player.id'+sid+'= new Player (sid,pname)');
    this.players.push(pname);
//    console.log('Ausgabe nach add to players: '+this.players);
  },this;
  this.removePlayer = function(sid) {
    eval("pname = this.player.id"+sid+".pname");
	  eval('delete this.player.id'+sid);
    const index = this.players.indexOf(pname);
    if (index > -1) {
      this.players.splice(index, 1);
    };
//    console.log('Ausgabe nach remove from players: '+this.players);
  },this;
  this.ready = 0;
  this.running = 0;
  this.round = 0;
  this.fields = {};
  this.addField = function(feldnr) {
    eval("this.fields.canvas"+feldnr+" = new Field (feldnr)");
  },this;
  this.hadTurn = 0;
  this.currQuestion = 'Not yet assigned';
};

function Player (socketid, nickname) {
	this.sid=socketid;
	this.pname=nickname;
  this.gamestate=0;
  //this.getrunken=0;
  this.isAdmin=0;
  this.ready=0;
  this.hasTurn=0;
};

function Field (feldnr) {
  this.location=feldnr;
  this.category=getExcercise();
  //this.categoryname='';
};


function updateRoom (room){
  eval("io.to(room).emit('update_room', rooms.room"+room+")");
}

function checkReady (room) {
  if (checkRoom(room)===1){
    var count = 0;
    var divider = 0;
    if (eval("rooms.room"+room+".running") === 0) {
      eval("for (const property in rooms.room"+room+".player) {eval('value = rooms.room'+room+'.player.'+property+'.ready');count = count + value;divider++;};")
      //eval("if (count===divider)  {rooms.room"+room+".ready = 1; console.log('"+room+" is ready')} else {rooms.room"+room+".ready = 0; console.log('"+room+" is not ready')}");
      eval("if (count===divider)  {rooms.room"+room+".ready = 1;} else {rooms.room"+room+".ready = 0;}");
      eval("if (rooms.room"+room+".ready === 1) {startGame(room);}");
      //Unteren beiden zeilen kombinieren
    }
    //else {eval("console.log('Checked room "+room+" but it was already running')")}
  }
};

//var fields = {};
function startGame(room) {
  //Init
  if (checkRoom(room)===1){
    if (eval("rooms.room"+room+".running") === 0) {
      //eval("rooms.room"+room+".running = 1");
      //eval("io.to(room).emit('update_room', rooms.room"+room+")");
      io.to(room).emit('gamestart');
      eval("console.log('Started game in room "+room+"')");
      eval("rooms.room"+room+".running = 1");
      eval("io.to(room).emit('nachricht', 'Spielbeginn!')");
      eval("io.to(room).emit('gamestate', 'Spielbeginn', 'Jetzt ist '+ rooms.room"+room+".players[0] +' an der Reihe')");

      for (var i=1;i<26;i++){
        //if (i < 10) {eval("rooms.room"+room+".addField("+i+")")} else {eval("rooms.room"+room+".fields.canvas"+i+" = new Field (i)");};
        eval("rooms.room"+room+".fields.canvas"+i+" = new Field (i)");
      }

      eval("io.to(room).emit('update_room', rooms.room"+room+")");
      nextRound(room);
    }
    else {eval("console.log('"+room+" is already running')")}
    //Logik um das Spiel wieder zurrück zu setzen!!
  }

};

function nextRound(room) {
  if (checkRoom(room)===1){
    //noTurn(room);
    //console.log('Nächste Runde ist gestartet');


    eval("rooms.room"+room+".hadTurn = 0");
    eval("rooms.room"+room+".round = rooms.room"+room+".round + 1;");
    eval("io.to(room).emit('nachricht', 'Runde '+rooms.room"+room+".round)");
    nextPlayer(room);
    //updateRoom(room);
  }
};

function nextPlayer(room) {

  eval("if (rooms.room"+room+".hadTurn == rooms.room"+room+".players.length) {console.log('next Round'); nextRound(room);} else { console.log('next Player');localhadTurn = rooms.room"+room+".hadTurn;}");
  eval("IDnextP = playerIDbyindex(rooms.room"+room+".player, rooms.room"+room+".players[localhadTurn])");
  eval("rooms.room"+room+".player."+IDnextP+".hasTurn = 1");


  eval("if (rooms.room"+room+".round !== 1 && rooms.room"+room+".hadTurn !== 0) {updateRoom(room)}");

}

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
rooms.roomWurm = new Room('Wurm');

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
//        eval("io.to(room).emit('currOnline', rooms.room"+room+".players)");
        eval("io.to(room).emit('update_room', rooms.room"+room+")");
      };
//      io.emit('currOnline', players);
//      console.log(players)


    }
  });

  socket.on('nachricht', (msg) => {
    if (msg === '') {} else {
      if (checkRoom(room)===1){
        eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+': '+msg)");
      };
    };
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
    if (gc_exists === undefined ) {socket.emit('gc_isavalible', '0');} else {
      socket.emit('gc_isavalible', '1');
    }
  });

  /*socket.on('checkuser', (cu) =>  {
    var cu_exists;
    if (cu_exists === undefined ) {socket.emit('cu_isavailable', '0');}
    else {
      socket.emit('cu_isavailable', '1');
    }
  });*/


  socket.on('newroom',() => {
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
//    eval("io.to(room).emit('currOnline', rooms.room"+room+".players)");
    eval("rooms.room"+room+".player.id"+id+".isAdmin = 1");
    eval("io.to(room).emit('update_room', rooms.room"+room+")");
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
//      eval("io.to(room).emit('currOnline', rooms.room"+room+".players)");
      eval("io.to(room).emit('update_room', rooms.room"+room+")");
      if (eval("rooms.room"+room+".running === 1")) {socket.emit('gamestart')};
    };
    socket.emit('your_room_is', room);
  });

  socket.on('ready', () => {
    if (checkRoom(room)===1){
      if (eval("rooms.room"+room+".player.id"+id+".ready") === 0) {
        //console.log("From 0 to 1");
        eval("rooms.room"+room+".player.id"+id+".ready = 1");
        eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+' ist bereit')");
      }
      else {
        //console.log("From 1 to 0");
        eval("rooms.room"+room+".player.id"+id+".ready = 0");
        eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+' ist doch nicht bereit')");
      }
      checkReady(room);
    }
  });

  socket.on('roll', () => {
    if (checkRoom(room)===1){
            //eval("rooms.room"+room+".hadTurn = rooms.room"+room+".hadTurn + 1");
            //eval("if (rooms.room"+room+".player.id"+id+".hasTurn == 1){wuerfel = getRandomInt(6)+1;console.log('Gewürfelt: '+wuerfel);rooms.room"+room+".player.id"+id+".gamestate = rooms.room"+room+".player.id"+id+".gamestate + wuerfel;rooms.room"+room+".hadTurn = rooms.room"+room+".hadTurn + 1;noTurn(room);nextPlayer(room);updateRoom(room)}");
            wuerfel = getRandomInt(6)+1

            eval("if (rooms.room"+room+".player.id"+id+".hasTurn == 1){execRoll()}");

            function execRoll() {
              console.log('Gewürfelt: '+wuerfel);
              //eval("io.to(room).emit('nachricht', rooms.room"+room+".player.id"+id+".pname+' hat eine '+wuerfel+' gewürfelt')");

              /*
              eval("nextGS = rooms.room"+room+".player.id"+id+".gamestate + wuerfel");
              console.log('nextGS: '+nextGS);
              eval("nextGSif = 25 + (25 -(rooms.room"+room+".player.id"+id+".gamestate+wuerfel))");
              eval("nextGSifnew = (25 -(rooms.room"+room+".player.id"+id+".gamestate+wuerfel))");
              console.log('nextGSif: '+nextGSif);
              console.log('nextGSifnew: '+nextGSifnew);
              */

              //eval("if (nextGS > 25) {rooms.room"+room+".player.id"+id+".gamestate=25+(25-(rooms.room"+room+".player.id"+id+".gamestate+wuerfel))};console.log('gs>25');finishMove();");

              eval("if (rooms.room"+room+".player.id"+id+".gamestate + wuerfel > 25) {console.log('gs>25'); rooms.room"+room+".player.id"+id+".gamestate= rooms.room"+room+".player.id"+id+".gamestate + (25 -(rooms.room"+room+".player.id"+id+".gamestate+wuerfel)); finishMove();}");
              eval("if (rooms.room"+room+".player.id"+id+".gamestate + wuerfel < 25) {console.log('gs<25'); rooms.room"+room+".player.id"+id+".gamestate = rooms.room"+room+".player.id"+id+".gamestate + wuerfel;finishMove();}");

              eval("if (rooms.room"+room+".player.id"+id+".gamestate + wuerfel == 25) {console.log('gs==25');io.to(room).emit('gamestate', rooms.room"+room+".player.id"+id+".pname+' hat gerade eine '+wuerfel+' gewürfelt', rooms.room"+room+".players[rooms.room"+room+".hadTurn] +' hat gewonnen');rooms.room"+room+".currQuestion='Not yet assigned';startGame(room);}");

//if = 25; startGame, meldung spieler hat gewonnen
              //eval("rooms.room"+room+".player.id"+id+".gamestate = rooms.room"+room+".player.id"+id+".gamestate + wuerfel");
              function finishMove() {
                eval("rooms.room"+room+".hadTurn = rooms.room"+room+".hadTurn + 1;");
                eval("localhadTurn = rooms.room"+room+".hadTurn");
                eval("if (localhadTurn >= rooms.room"+room+".players.length) {localhadTurn = 0}");
                //console.log(util.inspect(rooms.roomWurm.player));
                eval("rooms.room"+room+".currQuestion = getExcercise(rooms.room"+room+".fields.canvas"+eval('rooms.room'+room+'.player.id'+id+'.gamestate')+".category)");
                //eval(console.log("rooms.room"+room+".currQuestion = getExcercise(rooms.room"+room+".fields.canvas"+eval('rooms.room'+room+'.player.id'+id+'.gamestate')+".category)"));
                eval("rooms.room"+room+".currQuestion = getExcercise(rooms.room"+room+".fields.canvas"+eval('rooms.room'+room+'.player.id'+id+'.gamestate')+".category, rooms.room"+room+".currQuestion)");
                nomoreTurn(room);nextPlayer(room);updateRoom(room)
                eval("io.to(room).emit('gamestate', rooms.room"+room+".player.id"+id+".pname+' hat gerade eine '+wuerfel+' gewürfelt', 'Jetzt ist '+ rooms.room"+room+".players[localhadTurn] +' an der Reihe')");
              }
              //eval("console.log('Aktuelle Frage: '+rooms.room"+room+".currQuestion)");

            }

            /*eval("localhadTurn = rooms.room"+room+".hadTurn");
            eval("IDnextP = playerIDbyindex(rooms.room"+room+".player, rooms.room"+room+".players[localhadTurn])");
            eval("rooms.room"+room+".round = rooms.room"+room+".hadTurn = rooms.room"+room+".round = rooms.room"+room+".hadTurn + 0");*/
        //Würfellogik
    }
  });

});

function nomoreTurn(room){
  //console.log("Versuche Zurückzusetzen");
  eval("localhadTurn = rooms.room"+room+".hadTurn - 1");
  //console.log("localhadTurn: "+ localhadTurn)
  eval("IDnextP = playerIDbyindex(rooms.room"+room+".player, rooms.room"+room+".players[localhadTurn])");
  //console.log(IDnextP)
  eval("rooms.room"+room+".player."+IDnextP+".hasTurn = 0");
  //eval("console.log(util.inspect(rooms.room"+room+".player."+IDnextP+"))");
}
