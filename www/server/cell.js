/**
 * Décrit une cellule de la grille.
 */
class Cell {
    /**
     * À l'initialisation, la Cell n'a pas d'owner.
     * @param {Integer} x Coordonnée x de la Cell.
     * @param {Integer} y Coordonnée y de la Cell.
     * @param {Moto} owner La moto présente sur cette Cell.
     */
    constructor(x, y, owner = null) {
        this.x = x;
        this.y = y;
        this.owner = owner;
    }

    /**
     * Indique si la Cell a un propriétaire.
     * @returns true si la Cell a un owner, false sinon.
     */
    hasOwner() {
        return this.owner != null;
    }

    /**
     * Définit le propriétaire de cette Cell.
     * @param {Moto} moto La moto qui devient owner de cette Cell.
     */
    setOwner(moto) {
        if (this.owner != null)
            throw "Impossible d'attribuer cette Cell à une moto, elle appartient déjà à une autre.";
        this.owner = moto;
    }

    /**
     * Redéfinit cette Cell comme n'ayant pas de propriétaire.
     */
    resetOwner() {
        this.owner = null;
    }
}