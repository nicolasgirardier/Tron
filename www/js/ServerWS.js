const http = require('http');
const server = http.createServer();
server.listen(9898); // On écoute sur le port 9898

console.log("server running on port 9898");
// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
 httpServer: server
});

const conn = new Mongo();
db = conn.getDB("tronDB");
db = connect("localhost:27020/tronDB");

// Mise en place des événements WebSockets
wsServer.on('request', function(request) {
    console.log("Requête reçue")
    
    const connection = request.accept(null, request.origin);

    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', function(message) {
        console.log(message.utf8Data);
        connection.sendUTF('Hi this is WebSocket server!');
     });
     connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
     });
});