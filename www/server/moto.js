/**
 * Une moto jouée par un joueur.
 */
class Moto {
    /**
     * @param {String} idPlayer L'id du joueur qui joue cette moto.
     * @param {Cell} startCell La Cell de départ de la moto.
     * @param {String} color La couleur utilisée pour dessiner la moto.
     */
    constructor(idPlayer, name, startCell, color) {
        this.idPlayer = idPlayer;
        this.name = name;

        this.move(startCell);
        this.direction = new Direction();

        this.color = color;
        this.isDead = false;
        this.score = 0;
    }

    /**
     * Déplace cette moto sur la Cell en paramètre. Doit être différente
     * de null. Met à jour le score pour avoir effectué un déplacement.
     * @param {Cell} cell La nouvelle position de la moto.
     */
    move(cell) {
        this.head = cell;
        cell.setOwner(this);
        this.incrementScore(Config.SCORE_BONUS_FOR_MOVE);
    }

    /**
     * Cette moto a perdu.
     */
    lost() {
        this.head.resetOwner();
        this.head = null;
        this.isDead = true;
        this.direction.reset();
        //TODO: mettre à jour la bdd
    }

    /**
     * Incrémente le score de la moto.
     * @param {Number} incr Valeur d'incrémentation du score de cette moto.
     */
    incrementScore(incr) {
        this.score += incr;
    }
}
