//Inspiration: Picolo und Saufen.io
//Schluckspecht von Larissa Eger, Kubilay Kaya und Jan Hillen
//Todo: Kick User
//Todo: Keine Doppelten Usernames IN EINEM RAUM
//Todo: Gamcode <10000  &  >100000
//Regel, Liste mit Regel, Regeln begrenz auf Runden (neue function "nextround()"), window.promt wenn regel abgelaufen
//Wenn alle den Raum verlassen haben, dann lösch ihn
//Nach würfeln "gemacht"-Knopf, damit der nächste Würfeln kann
//Dynamische Feldgröße. Host kann Feldmaße selbst bestimmen durch parameter, die dann mit for-Schleifen die Canvastabellen erstellen

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var getExcercise = require('./aufgaben');

server.listen(3001, function() {
  console.log('Started on Port 3001');
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
	  this.player[sid]= new Player (sid,pname);
    //console.log("sid: "+sid);
    this.players.push(pname);
//    console.log('Ausgabe nach add to players: '+this.players);
  },this;
  this.removePlayer = function(sid) {
    pname = this.player[sid].pname;
	  delete this.player[sid];
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
    eval("this.fields.canvas"+feldnr+" = new Field (feldnr);");
  },this;
  this.hadTurn = 0;
  this.currQuestion = 'Not yet assigned';
  this.currCategory = 'Not yet assigned';
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
};


function updateRoom (room){
  io.to(room).emit('update_room', rooms.room[room]);
}

function checkReady (room) {
  if (checkRoom(room)===1){
    var count = 0;
    var divider = 0;
    if (rooms.room[room].running === 0 || rooms.room[room].running === 2) {
      for (const property in rooms.room[room].player) {value = rooms.room[room].player[property].ready;count = count + value;divider++;};
      //if (count===divider)  {rooms.room[room].ready = 1; console.log('[room] is ready')} else {rooms.room[room].ready = 0; console.log('[room] is not ready')}");
      if (count===divider)  {rooms.room[room].ready = 1;} else {rooms.room[room].ready = 0;};
      if (rooms.room[room].ready === 1) {startGame(room);};
      //Unteren beiden zeilen kombinieren
    }
    //else {console.log('Checked room [room] but it was already running')")}
  }
};

//var fields = {};
function startGame(room) {
  //Init
  if (checkRoom(room)===1){
    if (rooms.room[room].running === 0 || rooms.room[room].running === 2) {
      //rooms.room[room].running = 1");
      //io.to(room).emit('update_room', rooms.room[room]);
      rooms.room[room].fields = {};
      io.to(room).emit('gamestart');
      console.log('Started game in room '+ room);
      rooms.room[room].running = 1;
      io.to(room).emit('nachricht', 'Spielbeginn!');
      io.to(room).emit('gamestate', 'Spielbeginn', 'Jetzt ist '+ rooms.room[room].players[0] +' an der Reihe');

      for (var i=1;i<26;i++){
        //if (i < 10) {rooms.room[room].addField("+i+")")} else {rooms.room[room].fields.canvas"+i+" = new Field (i);};
        rooms.room[room].fields["canvas"+i] = new Field (i);
        eval("if (typeof rooms.room[room].fields.canvas"+(i-1)+" !== 'undefined') {if (rooms.room[room].fields.canvas"+i+".category == rooms.room[room].fields.canvas"+(i-1)+".category) {rooms.room[room].fields.canvas"+i+".category = getExcercise();console.log('Feld neu ausgewählt: '+i)} }")
      }

      io.to(room).emit('update_room', rooms.room[room]);
      nextRound(room);
    }
    else {console.log(room +' is already running')}
    //Logik um das Spiel wieder zurrück zu setzen!!
  }

};

function nextRound(room) {
  if (checkRoom(room)===1){
    //noTurn(room);
    //console.log('Nächste Runde ist gestartet');


    rooms.room[room].hadTurn = 0;
    rooms.room[room].round = rooms.room[room].round + 1;
    io.to(room).emit('nachricht', 'Runde '+rooms.room[room].round);
    nextPlayer(room);
    //updateRoom(room);
  }
};

function nextPlayer(room) {

  if (rooms.room[room].hadTurn == rooms.room[room].players.length) {console.log('next Round'); nextRound(room);} else { console.log('next Player');localhadTurn = rooms.room[room].hadTurn;};
  IDnextP = playerIDbyindex(rooms.room[room].player, rooms.room[room].players[localhadTurn]);
  rooms.room[room].player[IDnextP].hasTurn = 1;


  if (rooms.room[room].round !== 1 && rooms.room[room].hadTurn !== 0) {updateRoom(room)};

}

function checkRoom (gc) {
  var result;
  if (rooms.room[gc] == undefined) {result = 0;} else {result = 1;};
  return result
};

//Vielleicht unnötig
function msg_to_room (room, topic, msg) {
      io.to(room).emit(topic, msg);
};

var rooms = {};
rooms.room = [];
rooms.room["Wurm"] = new Room('Wurm');

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
      if (checkRoom(room)===1 && typeof rooms.room[room].id[id] !== 'undefined'){
        io.to(room).emit('nachricht', rooms.room[room].player[id].pname+' hat die Verbindung getrennt');
        rooms.room[room].removePlayer(id);
//        io.to(room).emit('currOnline', rooms.room[room].players);
        io.to(room).emit('update_room', rooms.room[room]);
      };
//      io.emit('currOnline', players);
//      console.log(players)


    }
  });

  socket.on('nachricht', (msg) => {
    if (msg === '') {} else {
      if (checkRoom(room)===1){
        io.to(room).emit('nachricht', rooms.room[room].player[id].pname+': '+msg);
      };
    };
//      io.to(room).emit('nachricht', room);
      console.log('Chat in [room]: '+socketuser+': '+msg);
    //io.emit('nachricht', socketuser+': '+msg);
/*console.log('--------------------------------------------------------------------------------------------------------')
console.log('Inspect socket: '+util.inspect(socket.adapter.sids))
console.log('--------------------------------------------------------------------------------------------------------')*/
  });

  socket.on('gamecode', (gc) => {
    var gc_exists;
    //                                                                                  CHECK IF GC === INT
    if (rooms.room[gc] == undefined) {} else {gc_exists = 1};
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
    //socket.join('[room]');
    rooms.room[room] = new Room (room);
    id = socket.id;
    id = id.replace(/[^a-zA-Z ]/g, "");
//    console.log('Clean ID: '+id);
    rooms.room[room].addPlayer(id,socketuser);
    socket.emit('your_room_is', room);
//    console.log('Inspect room: '+ util.inspect(rooms.room[room]));
    io.to(room).emit('nachricht', rooms.room[room].player[id].pname+' hat sich verbunden');
//    io.to(room).emit('currOnline', rooms.room[room].players);
    rooms.room[room].player[id].isAdmin = 1;
    io.to(room).emit('update_room', rooms.room[room]);
  });

  socket.on('joinroom', (jroom) => {
    room = jroom;
    //socket.join('[room]');
    socket.join(room);
    id = socket.id;
    id = id.replace(/[^a-zA-Z ]/g, "");
//    console.log('Clean ID: '+id);
    if (checkRoom(room) === 1) {
      if (rooms.room[room].players.length > 7) {socket.disconnect();}
      else {
        rooms.room[room].addPlayer(id,socketuser);
        io.to(room).emit('nachricht', rooms.room[room].player[id].pname+' hat sich verbunden');
  //      console.log('Inspect room: '+ util.inspect(rooms.room[room]));
  //      io.to(room).emit('currOnline', rooms.room[room].players);
        io.to(room).emit('update_room', rooms.room[room]);
        if (rooms.room[room].running === 1) {socket.emit('gamestart')};
      }
    };
    socket.emit('your_room_is', room);
  });

  socket.on('ready', () => {
    if (checkRoom(room)===1){
      if (rooms.room[room].player[id].ready === 0) {
        //console.log("From 0 to 1");
        rooms.room[room].player[id].ready = 1;
        io.to(room).emit('nachricht', rooms.room[room].player[id].pname+' ist bereit');
      }
      else {
        //console.log("From 1 to 0");
        rooms.room[room].player[id].ready = 0;
        io.to(room).emit('nachricht', rooms.room[room].player[id].pname+' ist doch nicht bereit');
      }
      checkReady(room);
    }
  });

  socket.on('roll', () => {
    if (checkRoom(room)===1){
            //rooms.room[room].hadTurn = rooms.room[room].hadTurn + 1");
            //if (rooms.room[room].player[id].hasTurn == 1){wuerfel = getRandomInt(6)+1;console.log('Gewürfelt: '+wuerfel);rooms.room[room].player[id].gamestate = rooms.room[room].player[id].gamestate + wuerfel;rooms.room[room].hadTurn = rooms.room[room].hadTurn + 1;noTurn(room);nextPlayer(room);updateRoom(room)}");
            wuerfel = getRandomInt(6)+1

            if (rooms.room[room].player[id].hasTurn == 1 && rooms.room[room].player[id].gamestate !== 25) {execRoll();};

            function execRoll() {
              //console.log("------------------------EXECROLL----------------------------")
              var gs=rooms.room[room].player[id].gamestate;
              //console.log('GS: '+gs)")
              //console.log('Gewürfelt: '+wuerfel);
              //console.log('GS+W: '+ (gs+wuerfel)); ")
              var result = gs+wuerfel;
              //console.log("result: "+result)
              if (result > 25){
                var newgs = 25 + (25-result);
                //console.log("newgs = " +newgs)
              }
              rooms.room[room].hadTurn = rooms.room[room].hadTurn + 1;
              //console.log(rooms.room[room].players[rooms.room[room].hadTurn-1]);
              //io.to(room).emit('nachricht', rooms.room[room].player[id].pname+' hat eine '+wuerfel+' gewürfelt');

              /*
              nextGS = rooms.room[room].player[id].gamestate + wuerfel");
              console.log('nextGS: '+nextGS);
              nextGSif = 25 + (25 -(rooms.room[room].player[id].gamestate+wuerfel));
              nextGSifnew = (25 -(rooms.room[room].player[id].gamestate+wuerfel));
              console.log('nextGSif: '+nextGSif);
              console.log('nextGSifnew: '+nextGSifnew);
              */

              //if (nextGS > 25) {rooms.room[room].player[id].gamestate=25+(25-(rooms.room[room].player[id].gamestate+wuerfel))};console.log('gs>25');finishMove();");
              if (rooms.room[room].player[id].gamestate + wuerfel > 25) {console.log('gs>25'); rooms.room[room].player[id].gamestate= 25 + (25 -(rooms.room[room].player[id].gamestate+wuerfel)); finishMove();};
              if (rooms.room[room].player[id].gamestate + wuerfel < 25) {console.log('gs<25'); rooms.room[room].player[id].gamestate = rooms.room[room].player[id].gamestate + wuerfel;finishMove();};
              if (result === 25) {rooms.room[room].player[id].gamestate = 25; console.log('gs==25');io.to(room).emit('gamestate', rooms.room[room].player[id].pname+' hat gerade eine '+wuerfel+' gewürfelt', rooms.room[room].players[rooms.room[room].hadTurn-1] +' hat gewonnen');rooms.room[room].currQuestion='Not yet assigned'; rooms.room[room].running = 0; resetRoom(room); updateRoom(room);};

             //if = 25; startGame, meldung spieler hat gewonnen
                           //rooms.room[room].player[id].gamestate = rooms.room[room].player[id].gamestate + wuerfel");
               function finishMove() {
                 localhadTurn = rooms.room[room].hadTurn;
                 if (localhadTurn = rooms.room[room].players.length) {localhadTurn = 0};
                 //console.log(util.inspect(rooms.roomWurm.player));
                 currQID = getExcercise(rooms.room[room].fields["canvas"+rooms.room[room].player[id].gamestate].category);
                 //eval(console.log("rooms.room[room].currQuestion = getExcercise(rooms.room[room].fields.canvas"+rooms.room[room].player[id].gamestate')+".category)"));
                 rooms.room[room].currQuestion = getExcercise(rooms.room[room].fields["canvas"+rooms.room[room].player[id].gamestate].category, currQID);
                 rooms.room[room].currCategory = getExcercise(rooms.room[room].fields["canvas"+rooms.room[room].player[id].gamestate].category, 0);
                 //console.log('Current GS= '+rooms.room[room].player[id].gamestate+'; currQID= '+currQID+'; currQuestion= '+rooms.room[room].currQuestion)")
                 nomoreTurn(room);nextPlayer(room);updateRoom(room)
                 io.to(room).emit('gamestate', rooms.room[room].player[id].pname+' hat gerade eine '+wuerfel+' gewürfelt', 'Jetzt ist '+ rooms.room[room].players[localhadTurn] +' an der Reihe');
                           }
              //console.log('Aktuelle Frage: '+rooms.room[room].currQuestion);

            }

            /*localhadTurn = rooms.room[room].hadTurn");
            IDnextP = playerIDbyindex(rooms.room[room].player, rooms.room[room].players[localhadTurn]);
            rooms.room[room].round = rooms.room[room].hadTurn = rooms.room[room].round = rooms.room[room].hadTurn + 0");*/
        //Würfellogik
    }
  });

});

function nomoreTurn(room){
  //console.log("Versuche Zurückzusetzen");
  localhadTurn = rooms.room[room].hadTurn - 1;
  //console.log("localhadTurn: "+ localhadTurn)
  IDnextP = playerIDbyindex(rooms.room[room].player, rooms.room[room].players[localhadTurn]);
  //console.log(IDnextP)
  rooms.room[room].player[IDnextP].hasTurn = 0;
  //console.log(util.inspect(rooms.room[room].player."+IDnextP+"));
}

function resetRoom (room){
  console.log("RESET "+room)
  rooms.room[room].running = 2;
  tr = rooms.room[room];
  for (currP in tr.player) {rooms.room[room].player[currP].ready = 0; rooms.room[room].player[currP].gamestate = 0};
  //for (var currP in rooms.room[room].player) {console.log('p: '+currP); rooms.room[room].player."+currP+".ready = 0;}");
}
