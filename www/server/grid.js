/**
 * Constitue la Grille de jeu, composée d'objets Cell.
 */
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        for (let i = 0; i < height; i++)
            for (let j = 0; j < width; j++)
                this.cells.push(new Cell(j, i));
    }

    /**
     * Retourne l'objet Cell aux coordonnées précisées en paramètres. Si aucune
     * Cell n'est présente à ces coordonnées, renvoie undefined.
     * @param {Integer} x Coordonnée x de la Cell.
     * @param {Integer} y Coordonnée y de la Cell.
     * @returns La Cell aux coordonnées (x, y).
     */
    getCell(x, y) {
        return this.cells.filter(cell => {return cell.x == x && cell.y == y})[0];
    }

    /**
     * Sachant une Cell et une Direction, retourne la Cell adjacente correspondante.
     * @param {Cell} cell La Cell
     * @param {Direction} direction La direction.
     * @returns La Cell adjacente.
     */
    getAdjacentCell(cell, direction) {
        switch (direction) {
            case "UP": return (cell.y > 0) ? this.getCell(cell.x, cell.y - 1) : null;
            case "DOWN": return (cell.y < Config.GRID_HEIGHT) ? this.getCell(cell.x, cell.y + 1) : null;
            case "LEFT": return (cell.x > 0) ? this.getCell(cell.x - 1, cell.y) : null;
            case "RIGHT": return (cell.x < Config.GRID_WIDTH) ? this.getCell(cell.x + 1, cell.y) : null;
            default: throw "Invalid direction";
        }
    }
}
