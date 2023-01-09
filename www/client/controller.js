/**
 * Le client clique sur "jouer au jeu" pour rejoindre une partie.
 */
function jouerJeu() {
    const idJoueur = "Dominique"; //TODO: Récupérer l'id de l'input du client.
    model.setIdJoueur(idJoueur);
    //TODO: annonce au serveur que Dominique vient jouer.
}

/**
 * Expected input :  ArrowUp|ArrowDown|ArrowLeft|ArrowRight
 * Expected output :    UP  |   DOWN  |  LEFT   |  RIGHT
 * @param {String} key Le représentation textuelle de la touche d'input.
 */
function sendControlToServer(key) {
    return key.substring(5).toUpperCase();
    //TODO: envoyer ce contrôle au serveur.
}

/**
 * Le client reçoit un JSON du serveur. Il contient premièrement des informations
 * sur l'état de la Game, pour savoir quelle vue doit être affichée. Ensuite, il
 * contient d'autres data qui seront utiles pour le contenu de la page.
 * @param {Object} jsonObj Un objet JSON provenant du serveur.
 */
function getJsonFromServer(jsonObj) {
    /**
     * Si la Game a commencé.
     */
    console.log(jsonObj["hasStarted"])
    if (jsonObj["hasStarted"]) {
        console.log("la game a commencé !")
        /**
         * Si la grid n'a jamais été dessinée, on la dessine.
         * Sinon, on s'occupe simplement de repeindre l'ancienne.
         */
        model.show("GRID");
        if (!model.drawGridOnce())
            drawGrid(jsonObj["grid"]);
        else
            repaintGrid(jsonObj["grid"]);
    } else 
    /**
     * Si la Game s'est terminée.
     */
    if (jsonObj["hasFinished"]) {

        model.show("ENDING");
        drawEndingRoom(jsonObj["motos"]);
    }
    /**
     * Si la Game n'a pas encore commencé.
     */
    else {
        model.show("WAITING");
        drawWaitingRoom(jsonObj["players"], jsonObj["requestedNbPlayers"], jsonObj["motos"]);
    }
}

/**
 * On ajoute sur la gridDOM l'évènement d'input clavier pour récupérer
 * les différents contrôles d'un client pour déplacer sa moto.
 * @param {KeyEvent} e L'évènement clavier.
 * @returns Envoie un contrôle au serveur.
 */
gridDOM.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            return sendControlToServer(e.key);
    }
}

/**
 * Au lancement, on affiche la page de connection.
 */
model.show("CONNECTION");
drawConnectionPage();