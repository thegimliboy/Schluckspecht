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
      return checkEx(excerciseID) || eval("(getRandomInt(excercises.K"+i+".length-1)+1)");
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
    'Saufen',
    'Alle mit weißen Socken trinken.', //Index = [0]
    'Du und die Person deiner Wahl trinkt.',
    'Alle mit einem Handy von Samsung trinken.',
    'Alle Jungs trinken.',
    'Alle, die vor dir sind, trinken.',
    'Alle trinken.',
    'Alle, die hinter dir sind trinken.',
    'Du trinkst.',
    'Alle Mädchen trinken.',
    'Trinke 3 Schlucke.',
    'Alle mit braunen Haaren trinken.',
    'Alle mit blonden Haaren trinken.',
    'Alle, die Geschwister haben, trinken.',
    'Alle, die größer als 1,70m sind, trinken.',
    'Trinke, wenn du schon einmal sitzen geblieben bist.',
    'Trinke 5 Schlucke, wenn du blaue Augen hast oder verteile 3 wenn du braune Augen hast.',
    'Alle, die vergeben sind, geben 5 Schlucke an einen Single ab.',
    'Trinke, wenn du mehr als 4 Ex-Freund/innen hast.',
    'Trinke, wenn du verliebt bist.',
    'Trinke, wenn du schon mal betrunken Auto gefahren bist.',
    'Alle, die Sport im Verein machen, trinken.',
    'Alle mit einem Zweitnamen trinken.',
    'Alle mit einer Allergie trinken.',
    'Derjenige, der als nächstes Geburtstag hat, darf 4 Schlucke verteilen.',
    'Alle mit einem "A" im Vornamen trinken.',
    'Alle mit einem iPhone trinken',
    'Shot! Shot! Shot!',
    'Alle außer dir trinken',
    'Der Älteste trinkt',
    'Der Jüngste trinkt',
    'Alle mit schwarzen Socken trinken',
    'Verteile 6 Schlucke',
    'Endlich kannst du trinken :)',
    'Trinke, wenn du in einem Fitnessstudio angemeldet bist.',
    'Trinke, wenn du einen Fake-Account auf Instagram hast.',
    'Alle Einzelkinder trinken.',
    'Alle, die über einen Freund Netflix schauen, trinken'
  ],
  K2: [  //Aufgabe
    'Aufgabe',
    'Nenne die Nachnamen aller Spieler. Wenn du einen Fehler machst, musst du 2 Schlucke trinken.',
    'Sage das Alphabet rückwärts auf. Wenn du einen Fehler machst, musst du dein Glas exen.',
    'Zähle asiatische Hauptstädte auf. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 3 Schlucke.',
    'Nenne direkte Nachbarländer von Deutschland. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 3 Schlucke.',
    'Erzähle eine peinliche Story oder trinke 5 Schlucke.',
    'Wer ist deiner Meinung nach die größte Partykanone. Diese Person verteilt 2 Schlucke.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten auswandern? Der Auswanderer trinkt 3 Schlucke.',
    'Du musst entscheiden: Welcher Spieler wird heute am ehesten kotzen? Die Pussy trinkt 5 Schlucke.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten für immer auf Internet verzichten? Der Steinzeitmensch verteilt 3 Schlucke.',
    'Du musst entscheiden: Welcher Spieler würde eher ein Stalker werden? Nehmt euch in Acht und lasst denjenigen 3 Schlucke trinken.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten eine Dating App nutzen? Der Tinderboy trinkt 4 Schlucke.',
    'Verteile für jeden Buchstaben in deinem Namen einen Schluck.',
    'Nenne alle Planeten. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 3 Schlucke.',
    'Zähle deutsche Bundeskanzler auf. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 4 Schlucke.',
    'Überleg dir einen Reim in dem die Worte "Fisch" und "Garten" vorkommen. Du hast 30 Sekunden Zeit!',
    'Nenne die Geburtstage aller Spieler. Wenn du einen Fehler machst, musst du 3 Schlucke trinken.',
    'Erzähle eine peinliche Kotz-Story! Trau dich oder trink 5 Schlucke.',
    'Überleg dir einen Reim in dem die Worte "Schluckspecht" und "Flasche" vorkommen.',
    'Nenne Songtitel von Ed Sheeran. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 4 Schlucke.',
    'Zähle Bundesstaaten der Vereinigten Staaten von Amerika auf. Du kannst aufhören, wann du willst, verlierst jedoch beim ersten Fehler und trinkst dann 4 Schlucke.',
    'Antworte auf eine peinliche Frage, die die anderen Mitspieler dir stellen oder sei ein Angsthase und trink dein Glas aus.',
    'Du musst entscheiden: Welcher Spieler kommt am ehesten ins Gefängnis? Der Sträfling trinkt 4 Schlucke.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten in RTL-Trashserien mitspielen? Die Trashqueen trinkt 3 Schlucke.',
    'Du musst entscheiden: Welcher Spieler würde am ehesten ein Straßenschild klauen? Der Dieb verteilt 4 Schlucke.'
  ],
  K3: [  //Spiel
    'Spiel',
    'Reime auf "Bier". Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du beginnst.',
    'Reime auf "Flasche". Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du beginnst.',
    'McDonalds oder Burger King? Stimmt in der Gruppe ab. Die Verlierer trinken 3 Schlucke.',
    'Lieber reich und unglücklich oder arm und glücklich sein? Stimmt in der Gruppe ab. Die Verlierer trinken 4 Schlucke.',
    'Lieber alles sagen, was man denkt oder nie wieder etwas sagen können? Stimmt in der Gruppe ab. Die Verlierer trinken 2 Schlucke.',
    'Lieber nie wieder Pizza essen oder nie weder Döner essen? Stimmt in der Gruppe ab. Die Verlierer trinken 5 Schlucke.',
    'Lieber so lange Arme wie Beine haben oder so lange Beine wie Arme? Stimmt in der Gruppe ab. Die Verlierer trinken 4 Schlucke.',
    'Lieber fliegen können oder unsichtbar sein? Stimmt in der Gruppe ab. Die Verlierer trinken 2 Schlucke.',
    'Themenspiel: Dinge, die man oft verliert. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du beginnst.',
    'Themenspiel: Dinge, die man gewinnen kann. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 4 Schlucke trinken. Du beginnst.',
    'Themenspiel: Supermärkte in der Nähe. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 5 Schlucke trinken. Du beginnst.',
    'Themenspiel: Bekannte Automarken. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 4 Schlucke trinken. Du beginnst.',
    'Themenspiel: Bekannte Schuhmarken. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du fängst an.',
    'Themenspiel: Berühmte Schauspieler. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du fängst an.',
    'Jeder Spieler sagt etwas, das er noch nie gemacht hat. Alle, die es schonmal gemacht haben, müssen 1 Schluck trinken. Du fängst an.',
    'Themenspiel: Dinge, die Frauen in der Handtasche haben. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 5 Schlucke trinken. Du fängst an.',
    'Themenspiel: Gemüsesorten. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du fängst an.',
    'Zuerst Müsli oder Milch in die Schüssel? Stimmt in der Gruppe ab. Die Verlierer trinken 3 Schlucke.',
    'Themenspiel: Was Mamas gut können. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du fängst an.',
    'Themenspiel: Charaktere aus The Big Bang Theory. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 3 Schlucke trinken. Du fängst an.',
    'Lieber deinen Schlüssel oder dein Handy verlieren? Entscheidet in der Gruppe. Die Verlierer trinken 4 Schlucke.',
    'Lieber Urlaub in den Bergen oder am Strand? Entscheidet in der Gruppe. Die Verlierer trinken 5 Schlucke.',
    'Themenspiel: Netflix Originalserien. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 5 Schlucke trinken.',
    'Hund oder Katze? Stimmt in der Gruppe ab. Die Verlierer trinken 3 Schlucke.',
    'Themenspiel: Soziale Netzwerke. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 4 Schlucke trinken. Du fängst an.',
    'Vodka oder Rum? Stimmt in der Gruppe ab. Die Verlierer trinken einen Shot.',
    'Themenspiel: Straßenschilder, die die Farbe Rot enthalten. Wem nichts mehr einfällt oder etwas doppelt sagt, muss 5 Schlucke trinken. Du fängst an.'
    ],
  K4: [  //Wahrheit
    'Wahrheit',
    'Bist du schon mal fremdgegangen? Beantworte die Frage oder trinke 5 Schlucke.',
    'Hast du schon mal einen Strafzettel bekommen? Beantworte die Frage oder trinke 3 Schlucke.',
    'Was ist das Letzte, wonach du gegoogelt hast? Beantworte die Frage oder trinke 2 Schlucke.',
    'Hast du schon mal einen Liebesbrief geschrieben? Beantworte die Frage oder trinke 3 Schlucke.',
    'Was ist das Peinlichste, das du jemals gemacht hast? Beantworte die Frage oder trinke 5 Schlucke.',
    'Was ist deine beste und was ist deine schlechteste Eigenschaft? Beantworte die Frage oder trinke 3 Schlucke.',
    'Wenn du blind wärst, wer aus der Runde wäre dein Blindenhund? Dein Helfer trinkt 3 Schlucke.',
    'Welche Straftat hast du schon begangen? Beantworte die Frage oder trinke 3 Schlucke.',
    'Wenn du ein Tier sein könntest, welches wäre das? Beantworte die Frage oder trinke 2 Schlucke.',
    'Was würdest du tun, wenn du für einen Tag das andere Geschlecht wärst? Beantworte die Frage oder trinke 2 Schlucke.',
    'Hast du schon mal Drogen genommen? Beantworte die Frage oder trinke 3 Schlucke.',
    'Wann hattest du das letzte Mal einen Kater? Beantworte die Frage oder trinke 6 Schlucke.',
    'Hast du schon mal bei einem Test gespickt? Beantworte die Frage oder trinke 3 Schlucke.',
    'Hast du schon mal bei einem Date über dein Alter gelogen? Beantworte die Frage oder trinke 4 Schlucke.',
    'Warst du schon mal im Fernsehen zu sehen? Beantworte die Frage oder trinke 3 Schlucke.',
    'Hast du schon mal den Alkohol deiner Eltern getrunken? Beantworte die Frage oder trinke 54 Schlucke.',
    'Hast du schon mal eine Person des gleichen Geschlechts geküsst? Beantworte die Frage oder trinke 3 Schlucke.',
    'Hast du schon mal jemanden angezeigt? Beantworte die Frage oder trinke 3 Schlucke.',
    'Hast du schon mal komplett angezogen geschlafen, weil du zu betrunken warst dich auszuziehen? Beantworte die Frage oder trinke 3 Schlucke.',
    'Wann warst du das letzte Mal betrunken? Beantworte die Frage oder trinke 3 Schlucke.'
    ],
  K5: [ //Regel
    'Regel',
    'Such dir deinen Trinkbuddy aus. Immer wenn du trinkst, muss dein Buddy auch trinken.',
    'Bestimme eine Person, die in den nächsten 3 Runden doppelt so viel trinken muss wie du.',
    'Du darfst alle Spieler nur noch mit Spitznamen ansprechen.',
    'Niemand darf mehr das Wort "Ja" sagen. Bei jedem Verstoß muss 1 Schluck getrunken werden.',
    'Du hast einen Joker! Wenn du ihn einsetzt, kannst du jemand anderen an deiner Stelle trinken lassen.',
    'Ab jetzt darf nicht mehr geflucht werden! Wer trotzdem ein Schimpfwort sagt, muss trinken.',
    'Alle Spieler müssen dich mit "Eure Hoheit" ansprechen',
    'Es muss ab jetzt immer mit der linken Hand getrunken werden. Bei jedem Verstoß müssen 3 Schlucke getrunken werden.',
    'Bevor getrunken wird muss ein Trinkspruch gesagt werden.',
    'Ihr dürft euer Getränk nicht mehr loslassen. Wer trotzdem loslässt, muss 5 Schlucke trinken.',
    'Immer, wenn jemand das Wort "Alkohol" sagt, muss getrunken werden.'
    ],
  K6: [ //Strafe
    'Strafe',
    'Trinke dein Glas auf ex',
    'Der Schluckspecht mag dich nicht! Deshalb musst du 5 Schlucke trinken.',
    'Durch dein Verhalten hast du den Schluckspecht verärgert und musst 3 trinken.',
    'Alle müssen nochmal etwas Alkohol in ihr Getränk schütten.',
    'Pech gehabt! Du musst 5 Schlucke trinken!',
    'Du bist das Opfer! Jeder Spieler darf beliebig viele Schlucke an dich verteilen.',
    'Die anderen Spieler einigen sich darauf, wie viele Schlucke du trinken musst.',
    'Trinke 5. Ohne Grund.',
    'Nich lang schnacken, Kopf in Nacken! Alle trinken 5 Schlucke.',
    'Ein Hoch auf den Schluckspecht! Alle müssen trinken.',
    'Alle müssen 10 Schlucke trinken.',
    'Trink 10!',
    'Die anderen Spieler können entscheiden, wie viele Schlucke du trinkst.',
    'Alle trinken einen Shot!'
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
