var room = {};

for (var i=1;i<26;i++){
  eval("feld = document.getElementById('canvas"+i+"')");
  var ctx = feld.getContext("2d");
  ctx.font = "60px Arial";
  ctx.fillText(i, 90, 90);
}

var saufenIMG = new Image();
saufenIMG.src = "gfx/Saufen.png";
var aufgabeIMG = new Image();
aufgabeIMG.src = "gfx/Aufgabe.png";
var spielIMG = new Image();
spielIMG.src = "gfx/Spiel.png";
var wahrheitIMG = new Image();
wahrheitIMG.src = "gfx/Wahrheit.png";
var regelIMG = new Image();
regelIMG.src = "gfx/Regel.png";
var strafeIMG = new Image();
strafeIMG.src = "gfx/Strafe.png";

for (var i=1; i<9;i++){
  eval("var p"+i+" = new Image();")
  eval("p"+i+".src = 'gfx/p"+i+".png'");
}

var border_cblIMG = new Image();
border_cblIMG.src = "gfx/border_cbl.png";
var border_cbrIMG = new Image();
border_cbrIMG.src = "gfx/border_cbr.png";
var border_ctlIMG = new Image();
border_ctlIMG.src = "gfx/border_ctl.png";
var border_ctrIMG = new Image();
border_ctrIMG.src = "gfx/border_ctr.png";
var border_lrIMG = new Image();
border_lrIMG.src = "gfx/border_lr.png";
var border_udIMG = new Image();
border_udIMG.src = "gfx/border_ud.png";
var border_1IMG = new Image();
border_1IMG.src = "gfx/border_1.png";
var border_25IMG = new Image();
border_25IMG.src = "gfx/border_25.png";

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
      document.getElementById('spieltitel').innerHTML = 'Gamecode: '+gameroom+' \t | Username: '+username;
      document.getElementById('setReady').style.visibility = 'visible';
  });

  socket.on('update_room', newroom => {
    room = newroom;
    console.log('Recieved room obj update')
    doOnlineL();
    if (typeof (room.fields.canvas1) !== 'undefined') {doCanvasU()};
  });

  $('form').submit(function(event){
    event.preventDefault();
    socket.emit('nachricht',$('#cn').val());
    $('#cn').val('');
    return false;
  });

  socket.on('nachricht', function(msg){
    $('#nachrichten').append($('<li>').text(msg));
    //document.getElementById('nachrichten').scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  socket.on('gamestate', function(rresult, currTurn){
    $('#spielstand').empty();
    //console.log(currTurn);
    if (currTurn == 'Jetzt ist '+ username +' an der Reihe') {currTurn = 'Du bist dran'; document.getElementById('roll').style.visibility = 'visible';}
    //console.log(currTurn);
    $('#spielstand').append($('<li>').text(rresult));
    //$('#spielstand').append($('<li>').text(currTurn));
    if (room.currQuestion == 'Not yet assigned') {} else {$('#spielstand').append($('<li>').text('Deswegen ist die Aufgabe: '+room.currQuestion))};
    $('#spielstand').append($('<li>').text(currTurn));
  });


  socket.on('gamestart', () =>{
    console.log("Game started");
    document.getElementById('setReady').style.visibility = 'hidden';
  });
});

function ready () {
  socket.emit('ready');
};

function roll () {
  socket.emit('roll');
  document.getElementById('roll').style.visibility = 'hidden';
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

function addToCanvas(i, img){
  /*var img = new Image();
  img.src = "gfx/Saufen.png";*/

  eval("thisCan = document.getElementById('canvas"+i+"')")
  var thisCanctx = thisCan.getContext('2d');
  thisCanctx.drawImage(img, 0, 0);
  }

function doCanvasU(){
  for (var i=1;i<26;i++){
    switch(eval("room.fields.canvas"+i+".category")) {
      case 1:
        addToCanvas(i, saufenIMG)
        //Welche Spieler sind auf Canvas i?
        //console.log(i+" is 1");
        break;
      case 2:
        addToCanvas(i, aufgabeIMG)
        //console.log(i+" is 2");
        break;
      case 3:
        addToCanvas(i, spielIMG)
        //console.log(i+" is 3");
        break;
      case 4:
        addToCanvas(i, wahrheitIMG)
        //console.log(i+" is 4");
        break;
      case 5:
        addToCanvas(i, regelIMG)
        //console.log(i+" is 5");
        break;
      case 6:
        addToCanvas(i, strafeIMG)
        //console.log(i+" is 6");
        break;

      default:
        console.log("Irgendwas lief schief. Kein Bild für Kategorie definiert?")
        break;
    }
    //Zeichne Player; i=Canvas
    for (var pX in room.player) {
      eval("pX = room.player."+pX);
      //console.log("pX.pname: "+pX.pname+"; pX.gamestate: "+pX.gamestate+"; i: "+i)
      if (pX.gamestate == i) {
        for (var j = 0; j<room.players.length; j++){
          if (room.players[j] == pX.pname) {
            j = j+1
            eval("addToCanvas(i, p"+j+")");
            console.log("Added to "+i+"; p"+j)
          }
        }
      }
    }

    switch(i) {
      case 16:
      case 24:
        eval("addToCanvas(i, border_cblIMG)")
        break;
      case 5:
      case 19:
        eval("addToCanvas(i, border_cbrIMG)")
        break;
      case 13:
      case 23:
        eval("addToCanvas(i, border_ctlIMG)")
        break;
      case 9:
      case 21:
        eval("addToCanvas(i, border_ctrIMG)")
        break;
      case 6:
      case 7:
      case 8:
      case 14:
      case 15:
      case 20:
        eval("addToCanvas(i, border_lrIMG)")
        break;
      case 2:
      case 3:
      case 4:
      case 10:
      case 11:
      case 12:
      case 17:
      case 18:
      case 22:
        eval("addToCanvas(i, border_udIMG)")
        break;
      case 1:
        eval("addToCanvas(i, border_1IMG)")
        break;
      case 25:
        eval("addToCanvas(i, border_25IMG)")
        break;

    }
  }
}



window.onbeforeunload = function(){
  if (room.running == 1){
    return 'Aber bist du sicher, dass du das Spiel verlassen willst?';
  }
};

/*
var canvas1 = document.getElementById("Buttons");
var ctx1 = canvas1.getContext("2d");
ctx1.fillStyle = "red";
ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
*/
