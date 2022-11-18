
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    //test
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

const ws = new WebSocket('ws://localhost:9898/');



ws.onopen = function(e){
    alert("Connexion établie !")
}

ws.onmessage = function(event) {
    alert(event.data);
  }

function sendMessage(){
    ws.send("Salut j'envoie un mess");
}