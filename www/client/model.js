/**
 * Le Model côté client indique essentiellement les vues à afficher.
 * Pour rappel, on dispose les vues comme différent 
 */
class Model {
    constructor() {
        this.idPlayer = null;

        this.connectionView = false;
        this.waitingView = false;
        this.gridView = false;
        this.endingView = false;

        this.gridDrawn = false;
        this.scoreBoardCreated = false;
    }

    setIdPlayer(idPlayer) {
        this.idPlayer = idPlayer;
    }

    show(view) {
        this.connectionView = view == "CONNECTION";
        this.waitingView = view == "WAITING";
        this.gridView = view == "GRID";
        this.endingView = view == "ENDING";
    }

    drawGridOnce() {
        let res = this.gridDrawn;
        this.gridDrawn = true;
        return res;
    }

    createScoreBoardOnce() {
        let res = this.scoreBoardCreated;
        this.scoreBoardCreated = true;
        return res;
    }
}

const model = new Model();