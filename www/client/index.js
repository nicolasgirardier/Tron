

let connected_status = false
let pseudo;

const ws = new WebSocket('ws://localhost:9898/');


/**
 * Quand le client arrive sur le site
 */
ws.onopen = function (e) {
    console.log("Connexion établie !");
}

/**
 * Quand client reçoit du JSON du serveur
 */
ws.onmessage = function (event) {
    getJsonFromServer(JSON.parse(event.data));
}
