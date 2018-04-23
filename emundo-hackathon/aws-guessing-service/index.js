/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * In dieser Aufgabe werden wir ein kleines guessNumberGame machen wobei Alexa
 * sich eine Zahl zwischen 0 und 100 wählt und der User Diese erraten muss.
 **/

'use strict';



const Alexa = require('alexa-sdk');

// #3 Attribute über session hinweg speichern
// callback wird benötigt, damit :saveState funktioniert sonst wird der :saveState 
// aufruf beendet, bevor die session attributes in der Datenbank abgespeichert werden.
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'guessing-game-manuel';
    alexa.registerHandlers(startGameHandlers,newSessionHandlers,guessModeHandlers,guessAttemptHandlers);// #2 Handler einfügen
    alexa.execute();
};

const states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the Number
    STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the Game
};

// Damit wir unsere Handler für NewSession und SessionEndedRequest nicht zweimal schreiben müssen
// bauen wir unseren eigenen Handler in dem wir uns darum kümmern
const newSessionHandlers = {
    // #4 Handler für NewSession und SessionEndedRequest
    'NewSession': function() {
        if(Object.keys(this.attributes).length ===0){
            this.attributes['gamesPlayed']=0;
            this.attributes['endedSessionCount']=0;
            this.attributes['guessNumber']=0;
        }    
        
        const gamesplayed=this.attributes['gamesPlayed'];
        const endedSessionCount=this.attributes['endedSessionCount'];
        const guessNumber=this.attributes['guessNumber'];
        this.handler.state=states.STARTMODE;
        this.handler.saveBeforeResponse = true;
        this.response.speak('game Ready').listen();
        this.emit(':responseReady');
    
    },
    'SessionEndedRequest': function() {
        this.attributes['endedSessionCount']++;
        this.handler.saveBeforeResponse = true;
        this.response.speak('bye').listen();
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        console.log("STOPINTENT");
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    }
};

const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    // #4 Handler für NewSession und SessionEndedRequest
    // #5 Handler für Unhandled hinzufügen
    // #6 Handler für AMAZON.YesIntent und AMAZON.NoIntent hinzufügen
    
   'NewSession': function() {
        this.emit('NewSession');
    },
    'SessionEndedRequest': function() {
        this.emit('SessionEndedRequest');
    },
    'Unhandled': function () {
        this.emit(':ask','tell me to start game');
    },
    'AMAZON.YesIntent': function(){
        this.attributes['gamesPlayed']=this.attributes['gamesPlayed']+1;
        this.attributes['guessNumber']=Math.floor(Math.random()*100);
        this.handler.state=states.GUESSMODE;
        this.emit(':ask', 'guess my number');
    },
     'AMAZON.NoIntent': function(){
         this.emit(':tell', 'bye');
    },
    'AMAZON.HelpIntent': function() {
        const message = 'I will think of a number between zero and one hundred, try to guess and I will tell you if it' +
            ' is higher or lower. Do you want to start the game?';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        // Ruft den StopIntent in newSessionHandlers auf
        this.emit('AMAZON.StopIntent');
    },    
    "AMAZON.CancelIntent": function() {
        // Ruft den CancelIntent in newSessionHandlers auf
        this.emit('AMAZON.CancelIntent');
    },
});


const guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    'NewSession': function() {
        this.emit('NewSession');
    },
    'SessionEndedRequest': function() {
        this.emit('SessionEndedRequest');
    },
    
    // #4 Handler für NewSession und SessionEndedRequest
    // #5 Handler für Unhandled hinzufügen
    // #7 Handler für GuessNumberIntent 
   
    'guessNumberIntent': function () {
        const guessNumber=this.attributes['guessNumber'];
        
        var number = parseInt(this.event.request.intent.slots.number.value);
        
        if(number < guessNumber){
              this.emit(':ask','my Number is higher!');
        } else if(number > guessNumber){
              this.emit(':ask','my Number is lower!');
        }else{
             this.handler.state=states.STARTMODE;
             this.attributes['endedSessionCount']++;
             this.emit(':ask','you are right, another round?');
             
        }
        this.emit(':ask','you are right, another round?');
    },
    'Unhandled': function () {
        this.emit(':ask','tell me a number');
    },
    'AMAZON.HelpIntent': function() {
        this.response.speak('I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
            ' if it is higher or lower.')
            .listen('Try saying a number.');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        // Ruft den StopIntent in newSessionHandlers auf
        this.emit('AMAZON.StopIntent');
    },    
    "AMAZON.CancelIntent": function() {
        // Ruft den CancelIntent in newSessionHandlers auf
        this.emit('AMAZON.CancelIntent');
    },
});

const guessAttemptHandlers = {
    // #7 Handler um GuessNumberIntent zu vereinfachen
    
};


