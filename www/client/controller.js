/**
 * Quand client envoie du JSON au serveur
 */
function sendMessage(obj, stat) {
    const msg = {
        status: stat,
        object: obj,
    };
    ws.send(JSON.stringify(msg));
}

/**
 * Le client clique sur "jouer au jeu" pour rejoindre une partie.
 */
function jouerJeu() {
    const idPlayer = document.getElementById("pseudo").value;
    model.setIdPlayer(idPlayer);
    let obj = {
        id: model.idPlayer,
    }
    sendMessage(obj, "connection");
}

function quitterJeu() {
    model.gridDrawn = false;
    clearGrid();
    model.show("CONNECTION");
    drawConnectionPage();
    let obj = {
        id: model.idPlayer,
    }
    sendMessage(obj, "disconnects");
}

/**
 * Expected input :  ArrowUp|ArrowDown|ArrowLeft|ArrowRight
 * Expected change :    UP  |   DOWN  |  LEFT   |  RIGHT
 * @param {String} key Le représentation textuelle de la touche d'input.
 */
function sendControlToServer(key) {
    let obj = {
        id: model.idPlayer,
        key: key.substring(5).toUpperCase(),
    }
    sendMessage(obj, "sendControl");
}

/**
 * Le client reçoit un JSON du serveur. Il contient premièrement des informations
 * sur l'état de la Game, pour savoir quelle vue doit être affichée. Ensuite, il
 * contient d'autres data qui seront utiles pour le contenu de la page.
 * @param {Object} jsonObj Un objet JSON provenant du serveur.
 */
function getJsonFromServer(jsonObj) {
    console.log(jsonObj);
    if (jsonObj["invalidConnection"])
        return alert("This name is being used right now, please choose an other one.");
        
    if (jsonObj["hasStarted"]) {
        model.show("GRID");
        if (!model.drawGridOnce()) {
            console.log("Je dessine la grille pour la première fois");
            drawGrid(jsonObj["grid"]);
        }
        else {
            console.log("Je redessine la grille");
            repaintGrid(jsonObj["grid"]);
        }
    } else if (jsonObj["hasFinished"]) {
        model.show("ENDING");
        emptyScoreBoard();
        drawEndingRoom(jsonObj["names"], jsonObj["cols"], jsonObj["scores"]);
    } else {
        model.show("WAITING");
        drawWaitingRoom(jsonObj["players"], jsonObj["requestedNbPlayers"], jsonObj["names"], jsonObj["cols"]);
    }
}

/**
 * On ajoute sur la gridDOM l'évènement d'input clavier pour récupérer
 * les différents contrôles d'un client pour déplacer sa moto.
 * @param {KeyEvent} e L'évènement clavier.
 * @returns Envoie un contrôle au serveur.
 */
document.onkeydown = function (e) {
    if (model.gridView) {
        switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                return sendControlToServer(e.key);
        }
    }
}

/**
 * Au lancement, on affiche la page de connection.
 */
model.show("CONNECTION");
drawConnectionPage();