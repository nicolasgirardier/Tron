/**
 * Décrit une direction pour une moto. Elle est constituée de 4 attributs.
 * Un seul peut être évalué à true. Au départ, ils sont tous évalués à false.
 */
class Direction {
    constructor() {
        this.reset();
    }

    /**
     * Reset la direction.
     */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
    }

    /**
     * Ré-évalue tous les attributs en fonction de la direction choisie. Une direction
     * est déterminée comme suit :
     * - Si la direction choisie n'est pas opposée à celle en cours, alors la direction est la direction choisie.
     * - Si la direction choisie est opposée à celle en cours, alors la direction reste celle en cours.
     * @param {String} key String indiquant la direction "LEFT", "RIGHT", "UP", "DOWN"
     */
    changeTo(key) {
        this.LEFT = (key == "LEFT" && !this.RIGHT) || (key == "RIGHT" && this.LEFT);
        this.RIGHT = (key == "RIGHT" && !this.LEFT) || (key == "LEFT" && this.RIGHT);
        this.UP = (key == "UP" && !this.DOWN) || (key == "DOWN" && this.UP);
        this.DOWN = (key == "DOWN" && !this.UP) || (key == "UP" && this.DOWN);
    }

    /**
     * @returns String indiquant la direction actuelle de la moto.
     */
    get() {
        if (this.LEFT)
            return "LEFT";
        if (this.RIGHT)
            return "RIGHT";
        if (this.UP)
            return "UP";
        if (this.DOWN)
            return "DOWN";
        return "START";
    }
}
