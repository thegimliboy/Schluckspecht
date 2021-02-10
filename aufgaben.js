//https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random
var util = require('util');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

function countCategories(categoryID){
  var counter = 0;
  for (const categoryID in excercises) {counter++;};
  return counter;
};

function getExcercise(categoryID, excerciseID){
  if (categoryID === undefined){
    return (getRandomInt(countCategories())+1);
  }

 for (var i=1;i<countCategories()+1;i++){
   switch (categoryID){
     case i:
      //eval("console.log('Kategorie "+i+"')");
      checkEx(excerciseID);
      return checkEx(excerciseID) || eval("(getRandomInt(excercises.K"+i+".length+1))");
    break;
    default:
    //console.log(i+" war es nicht");
  }
 }

  /*switch (categoryID){
      case 1:
        //console.log('Kategorie 1');
        checkEx(excerciseID);
        return checkEx(excerciseID) || (getRandomInt(excercises.K1.length));
      break;
      case 2:
        //console.log('Kategorie 2');
        checkEx(excerciseID);
        return checkEx(excerciseID) || (getRandomInt(excercises.K2.length));
      break;
      case 3:
        //console.log('Kategorie 2');
        checkEx(excerciseID);
        return checkEx(excerciseID) || (getRandomInt(excercises.K3.length));
      break;

      default:
        console.log('Keine korrekte ID eingegeben')
  }*/

  function checkEx(exerciseID){
    if (typeof excerciseID !== undefined){
      //console.log('Jajajaaa');
      frage = eval("excercises.K"+categoryID+"[excerciseID]");
      //console.log('Frage auf func: '+frage)
      return frage;
    }
  }
}

var excercises = {
  K1: [  //Saufen
    'Saufen', //Index = [0]
    'Alle mit weißen Socken trinken.',
    'Du und Person deiner Wahl trinkt.',
    'Alle mit einem Handy von Samsung trinken.',
    'Alle Jungs trinken.',
    'Alle, die vor dir sind, trinken.',
    'Alle trinken.',
    'Alle hinter dir trinken.',
    'Du trinkst.',
    'Alle Mädchen trinken.',
    'Trinke 3 Schlücke.',
    'Alle mit braunen Haaren trinken.',
    'Alle mit blonden Haaren trinken.',
    'Alle, die Geschwister haben, trinken.',
    'Alle, die größer als 1,70m sind, trinken.',
    'Trinke, wenn du schon einmal sitzen geblieben bist.',
    'Trinke 5, wenn du blaue Augen hast oder verteile 3 wenn du braune Augen hast.',
    'Alle, die vergeben sind, geben 5 Schlücke an einen Single ab.',
    'Trinke, wenn du mehr als 4 Ex-Freund/innen hast.',
    'Trinke, wenn du verliebt bist.',
    'Trinke, wenn du schonmal betrunken Auto gefahren bist.',
    'Alle, die Sport im Verein machen, trinken.',
    'Alle mit einem Zweitnamen trinken.',
    'Alle mit einer Allergie trinken.',
    'Derjenige, der als nächstes Geburtstag hat, darf 4 Schlücke verteilen.',
    'Alle mit einem "A" im Vornamen trinken.',
    'Alle mit einem iPhone trinken',
    'Shot Shot Shot',
    'Alle außer dir trinken',
    'Der Älteste trinkt',
    'Der Jüngste trinkt',
    'Alle mit schwarzen Socken trinken',
    'Verteile 6 Schlücke',

  ],
  K2: [  //Aufgabe
    'Aufgabe',
    'Nenne die Nachnamen aller Spieler.',
    'Sage das Alphabet rückwärts auf. Wenn du einen Fehler machst, musst du dein Glas exen',
    'Zähle asiatische Hauptstädte auf. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 3 Schlücke.',
    'Nenne direkte Nachbarländer von Deutschland. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 3 Schlücke.',
    'Erzähle eine peinliche Story oder trinke 5 Schlücke.',
    'Wer ist deiner Meinung nach die größte Partykanone. Diese Person verteilt 2 Schlücke.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten auswandern? Der Auswanderer trinkt 3 Schlüke.',
    'Du musst entscheiden: Welcher Spieler wird heute am ehesten kotzen? Die Pussy trinkt 5 Schlücke.',
    'Du musst entscheiden: Wer würde am ehesten für immer auf Internet verzichten? Der Steinzeitmensch verteilt 3 Schlücke.',
    'Du musst entscheiden: Welcher Spieler würde eher ein Stalker werden? Nehmt euch in Acht und lasst denjenigen 3 Schlücke trinken.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten eine Dating App nutzen? Der Tinderboy trinkt 4 Schlücke.',


  ],
  K3: [  //Spiel
    'Spiel',
    'Entweder nie mehr Zeit oder nie mehr Geld haben? Stimmt in der Gruppe ab. Die Verlierer trinken 4 Schlücke',
    'Reime auf "Bier". Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlücke trinken.',
    //'Reime auf '
  ]
};

//console.log('Hier isses: '+excercises.K1[2]);
//console.log('Zufällige Kategorie: '+getExcercise());
//console.log('Zufällige Frage aus Kategorie 1: '+getExcercise(1));

//console.log("Frage: "+getExcercise(getExcercise(),1));

/*
console.log("Erstelle feld1");
var feld1 = {};
console.log("Hole Kategorie")
feld1.Kategorie = getExcercise();

console.log("Hole FrageID")
feld1.frageid = getExcercise(feld1.Kategorie);

console.log("Hole Fragen als string")
feld1.frage =getExcercise(feld1.Kategorie,feld1.frageid);

console.log(util.inspect(feld1))

*/
//console.log(getExcercise());

module.exports = getExcercise;
