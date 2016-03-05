// Twilio Credentials 
var accountSid = 'AC8089d52ac38ce427d816b8e6a6cdb353'; 
var authToken = 'f4c024a7a2c6399e33e71ebb13eb37fa';
var numbers = ['+59176118425','+59177435914'];
var q = require('q'); 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
for (var index = 0; index < numbers.length; index++) {
   client.messages.create({ 
        to: numbers[index], 
        from: "+12028998771", 
        body: "Movimiento detectado",   
    }, function(err, message) {
        console.log(err); 
        // console.log(message.sid); 
    });
} 