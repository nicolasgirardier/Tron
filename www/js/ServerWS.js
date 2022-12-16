const http = require('http');
const server = http.createServer();
server.listen(9898); // On écoute sur le port 9898

console.log("server running on port 9898");
// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
 httpServer: server
});

var connections = [];
// Mise en place des événements WebSockets
wsServer.on('request', function(request) {
    console.log("Requête reçue")
    
    
    const connection = request.accept(null, request.origin);

    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', function(message) {
         //console.log(message.utf8Data);
         
         if(typeof(message)== "JSON");{
            
            var connectionStatusMessage;
            let account = connections.find(element => element.pseudo == message.utf8Data.pseudo)
            if(account == undefined){
               connections.push(message.utf8Data)
               //connection.sendUTF("pseudo encore inconnu")
            }
            else {

               if(message.utf8Data.password == account.password){
                  connectionStatusMessage={ "type" : "connection",
                  "status" : true, "pseudo" : message.utf8Data.pseudo}
                  connectionStatusMessage = JSON.stringify(connectionStatusMessage)
                  
                  connection.send(connectionStatusMessage)
               }
            }

            
            //connection.sendUTF("connected : true");
            //connection.sendUTF('Hi this is WebSocket server ! You are now connected');
            //console.log(connections[1].pseudo);
         }
        
     });
     connection.on('close', function(reasonCode, description) {
        
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
     });
});