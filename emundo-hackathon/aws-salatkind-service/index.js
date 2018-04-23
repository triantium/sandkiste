/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * Dieses Beispiel zeigt wie man ein Hello World Skill mit dem
 * Amazon Alexa Skills nodejs development Kit programmiert.
 **/

"use strict";

// Hier wird die Alexa SDK geladen und durch die Variable Alexa zur Verfügung gestellt.
const Alexa = require("alexa-sdk");
const net= require("network");

// Einstiegspunkt für unseren skill service
exports.handler = function (event, context, callback) {
    // Initialisierung des Handlers
    const alexa = Alexa.handler(event, context, callback);
    // Registrierung unseres handlers
    alexa.registerHandlers(newSessionHandlers);
    // DynamoDB einbinden
    alexa.dynamoDBTableName = 'salatkind-bestellassistent-manuel';
    // Service ausführen
    alexa.execute();
};

/*
const states = {
    ADDMODE: '_ADDMODE',
    EDITMODE: '_EDITMODE', // User is trying to guess the Number
    COMPLETEMODE: '_COMPLETEMODE'  // Prompt the user to start or restart the Game
};
*/

const newSessionHandlers = {
    // #4 Handler für NewSession und SessionEndedRequest
    'LaunchRequest':function(){
        this.response.speak('salatking started').listen();
        this.emit(':responseReady');
    } ,
    'Unhandled':function(){
        this.response.speak('unhandled').listen();
        this.emit(':responseReady');
    } ,
    'NewSession': function() {
        if(Object.keys(this.attributes).length ===0){
            var te=new Object();
            te.teamName='manuel';
            te.bestellungen=new Array();
            this.attributes['warenkorb']=te;
        }    
        
        //this.handler.state=states.ADDMODE;
        this.handler.saveBeforeResponse = true;
        this.response.speak('Willkomen bei Salatkind').listen();
        this.emit(':responseReady');
    
    },
    'SessionEndedRequest': function() {
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
    },
    "loescheBestellung":function(){
        const warez= this.attributes['warenkorb'];
        let name = (this.event.request.intent.slots.name.value);
        console.log(name);
        const best=warez.bestellungen;
        const toContain=best.filter(order => (order.name.toLowerCase() !== name.toLowerCase()));
        console.log(toContain);
        warez.bestellungen=toContain;
        
        this.handler.saveBeforeResponse = true;
        this.response.speak('Bestellungen für '+ name +" gelöscht").listen();
        this.emit(':responseReady');
    },
    "listeBestellugen":function(){
        const warez= this.attributes['warenkorb'];
        const best=warez.bestellungen;
        let msg= "Momentane Bestellungen: "
        let x;
        for (x of best){
            msg += "Für "+ x.name + ": " + x.salat.name +" mit " + x.dressing.name + " und " + x.brot.name +"\n";
        }
        
        this.response.speak(msg).listen();
        this.emit(':responseReady');
    },
    "newPosition":function(){
        const dialogstate = this.event.request.dialogState;
        const upInt= this.event.request.intent;
        const confirmationStatus = upInt.confirmationStatus;
        //console.log(this.event.request.intent.slots);
        if(dialogstate !== "COMPLETED"){
            this.emit(":delegate", upInt);
        }else{
            if(confirmationStatus === "CONFIRMED"){
                //
                
                
                
                let name = (this.event.request.intent.slots.name.value);
                let salat = holvalue(this.event.request.intent.slots.salat);
                let dressing = holvalue(this.event.request.intent.slots.dressing);
                let brot = holvalue(this.event.request.intent.slots.brot);
                let bestellung = new Object();
                
                bestellung.name=name;
                bestellung.salat=salat;
                bestellung.dressing=dressing;
                bestellung.brot=brot;
                
               // console.log(bestellung);
                const warez= this.attributes['warenkorb'];
                warez.bestellungen.push(bestellung);
                
                this.emit(":ask","bestätigt")
            }else{
                this.emit(":ask","verneint")
            }
        }
    },
        "order":function(){
            const warez= this.attributes['warenkorb'];
            console.log(warez.bestellungen);
            
            const tmp= new Object();
            tmp.teamName = warez.teamname;
            tmp.bestellungen =new Array();
            let x;
            const oBest= warez.bestellungen;
            console.log(oBest);
            for (x of oBest){
                console.log(x)
                const old=x;
                console.log(old);
                const newB=new Object();
                newB.name=old.name;
                newB.salat=old.salat.id;
                newB.dressing=old.dressing.id;
                newB.brot=old.brot.id;
                tmp.bestellungen.push(newB);
            }
            /*
            var x;
            var i = 0;
            var len = warez.bestellungen.length;
            console.log(warez);
            for (i=0; i < len; i++) {
                console.log(warez.bestellungen[i]);
               tmp.bestellungen.push(warez.bestellungen[i].id);
            }
            */
            console.log(tmp);
            net.post_json_object(tmp);
            
            
            this.attributes['warenkorb'].bestellungen=new Array();
            this.emit(":tell","Bestellung abgesetz goodbye")
        }
    
    
};

function holvalue (slot){
    console.log("holvalue");
    console.log(slot);
    const matchcode= slot.resolutions.resolutionsPerAuthority[0].status.code;
    const isValidSlotValue = matchcode === "ERR_SUCCESS_MATCH";
    const realValue = slot.resolutions.resolutionsPerAuthority[0].values[0].value;
    console.log(realValue);
    return realValue;
}