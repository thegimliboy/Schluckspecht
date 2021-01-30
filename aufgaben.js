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
      return checkEx(excerciseID) || eval("(getRandomInt(excercises.K"+i+".length))");
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
  K1: [
    'Aufgabe 1 von Kategorie 1', //Index = [0]
    'Aufgabe 2 dieser Kategorie',
    'Leck mich doch dis is Numma Droi',
    'Fuck leck mich'
  ],
  K2: [
    'Jetzt in der zweiten Kategorie',
    'Immernoch die zweite',
    'Und jetzt auch noch in der zweiten die dritte'
  ],
  K3: [
    'Jetzt in der dridde Kategorie',
    'Still die zweite'
  ]
};

//console.log('Hier isses: '+excercises.K1[2]);
//console.log('Zufällige Kategorie: '+getExcercise());
//console.log('Zufällige Frage aus Kategorie 1: '+getExcercise(1));

//console.log("Frage: "+getExcercise(getExcercise(),1));

/*console.log("Erstelle feld1");
var feld1 = {};
console.log("Hole Kategorie")
feld1.Kategorie = getExcercise();
console.log("Hole FrageID")
feld1.frageid = getExcercise(feld1.Kategorie);
console.log("Hole Fragen als string")
feld1.frage =getExcercise(feld1.Kategorie,feld1.frageid);

console.log(util.inspect(feld1))*/

//console.log(getExcercise());

module.exports = getExcercise;
