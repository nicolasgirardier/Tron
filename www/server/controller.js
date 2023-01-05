/**
 * gameWaiting et gamesPlaying contiennent des objets Games.
 * gameWaiting est la Game en attente de joueurs. Il ne peut y en avoir 
 * qu'une.
 * gamesPlaying est l'array des Game en cours.
 */
let gameWaiting = null;
const gamesPlaying = [];

function joueurConnecte(idPlayer) {
    //TODO: met à jour la BDD.
    
    /**
     * Si une game est en attente de joueurs (gameWaiting != null), on fait
     * se connecter le joueur à cette Game.
     */
    if (gameWaiting != null) {
        gameWaiting.playerConnects(idPlayer);
        /**
         * Si à présent la Game a le nombre de joueurs requis, elle passe dans
         * la liste des games en cours (gamesPlaying). Et gameWaiting redevient
         * null.
         */
        if (gameWaiting.hasStarted) {
            gamesPlaying.push(gameWaiting);
            gameWaiting = null;
        }
    }

    /**
     * Si aucune Game n'attend de joueurs (gameWaiting == null), on en créé
     * une nouvelle.
     */
    else {
        gameWaiting = new Game();
        gameWaiting.playerConnects(idPlayer);
    }
}

/**
 * On met à jour toutes les games.
 */
function updateGames() {
    if (gameWaiting != null)
        gameWaiting.update();
    gamesPlaying.forEach((game, index) => {
        if (game.toRemove)
            gamesPlaying.splice(index, 1);
        else
            game.update();
    })
}



// TEST
joueurConnecte("bastien")
joueurConnecte("cloé")
joueurConnecte("juliette")
joueurConnecte("nicolas")
let myGame = gamesPlaying[0];
myGame.getControlFromUser("bastien", "RIGHT");
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.getControlFromUser("juliette", "RIGHT");
myGame.update();
myGame.update();
myGame.update();
myGame.update();
myGame.update();