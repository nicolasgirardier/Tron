

let connected_status=false
let pseudo;

const ws = new WebSocket('ws://localhost:9898/');



ws.onopen = function(e){
    alert("Connexion établie !")
}

ws.onmessage = function(event) {
    console.log(event.data)
    let data = JSON.parse(event.data)
    if(data.type=="connection"){
        receiveConnectionValidated(data)
    }
  }

function sendMessage(){
    ws.send("Salut j'envoie un mess");
}

function validateInscription(){
    let pseudo = document.getElementById("pseudo").value;
    let passwd = document.getElementById("passwd").value;
    var tab = { "pseudo" : pseudo,
        "password" : passwd}

    varTabJSON = JSON.stringify(tab)
    ws.send(varTabJSON);
}

function receiveConnectionValidated(data){
    if(data.status == true){
        document.getElementById("connection").style.display="none"

        pseudo=data.pseudo
        document.getElementById("loginConnected").innerHTML+=pseudo
        document.getElementById("loginConnected").style.display="block"
    }
}