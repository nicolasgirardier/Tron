

let connected_status=false
let pseudo;

const ws = new WebSocket('ws://localhost:9898/');



ws.onopen = function(e){
    alert("Connexion établie !")
}

ws.onmessage = function(event) {
    let data = JSON.parse(event.data);

    getJsonFromServer(data);
    /*if(data.type=="connection"){
        receiveConnectionValidated(data)
    }*/
  }

function sendMessage(obj){
    ws.send(obj);
}

function validateInscription(){
    let pseud = document.getElementById("pseudo").value;
    let passwd = document.getElementById("passwd").value;
    
    /*var JsonTab = {};
    JsonTab.pseudo = pseudo;
    JsonTab.password = passwd;*/
    const tab = { pseudo : pseud,
        password : passwd};

    ws.send(JSON.stringify(tab));
}

function receiveConnectionValidated(data){
    if(data.status == true){
        document.getElementById("connectionForm").style.display="none"

        pseudo=data.pseudo
        document.getElementById("loginConnected").innerHTML+=pseudo
        document.getElementById("loginConnected").style.display="block"
    }
}