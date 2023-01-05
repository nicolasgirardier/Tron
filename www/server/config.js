/**
 * Configurations du jeu.
 */
class Config {
    /**
     * Largeur de la grille.
     */
    static GRID_WIDTH = 10;

    /**
     * Hauteur de la grille.
     */
    static GRID_HEIGHT = 10;

    /**
     * Nombre de joueurs requis.
     */
    static NB_REQUIRED_PLAYERS = 4;

    /**
     * Coordonnées de départ d'un joueur.
     */
    static PLAYER_STARTING_COORDS = [
        [1, 1],
        [Config.GRID_WIDTH - 1, Config.GRID_HEIGHT - 1],
        [Config.GRID_WIDTH - 1, 1],
        [1, Config.GRID_HEIGHT - 1],
    ];

    /**
     * Score ajouté pour avoir fait 1 mouvement.
     */
    static SCORE_BONUS_FOR_MOVE = 1;

    /**
     * Score ajouté pour avoir fait 1 kill.
     */
    static SCORE_BONUS_FOR_KILL = 100;

    /**
     * Score ajouté pour avoir gagné 1 partie.
     */
    static SCORE_BONUS_FOR_WIN = 1000;
}
