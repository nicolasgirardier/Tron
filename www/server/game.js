/**
 * Décrit l'état du jeu.
 */
class Game {
    constructor() {
        /**
         * Indique si la Game a commencé.
         */
        this.hasStarted = false;

        /**
         * Indique si la Game a finie.
         */
        this.hasFinished = false;

        /**
         * Indique si la Game doit être retirée de la liste des Game en cours.
         */
        this.toRemove = false;

        this.nbPlayers = 0;
        this.requestedNbPlayers = Config.NB_REQUIRED_PLAYERS;

        this.grid = new Grid(Config.GRID_WIDTH, Config.GRID_HEIGHT);
        this.motos = [];
    }

    /**
     * Ajoute un joueur à cette Game. Si la Game atteint le nombre de joueur requis,
     * elle change d'état pour ne plus accepter de nouveaux joueurs et commencer la
     * partie. Un joueur ne peut se connecter à la game que si celle-ci est dans l'état
     * "waiting".
     * @param {String} idPlayer L'id du joueur.
     */
    playerConnects(idPlayer) {
        this.nbPlayers++;

        let newMoto = new Moto(idPlayer, idPlayer, this.getCellStart(), this.getRandomColor());
        this.motos.push(newMoto);

        if (this.nbPlayers == this.requestedNbPlayers)
            this.hasStarted = true;
    }

    /**
     * Retire un joueur de la Game. Pour cela, il faut mettre à jour l'attribut de la
     * moto qu'il jouait. Les actions sont différentes selon l'état actuel de la Game. 
     * - Si la Game a commencé, il faut faire perdre le joueur puis mettre l'idJoueur
     * de sa moto à null (cela traduit le fait que plus aucun joueur ne joue cette moto.)
     * - Si la Game a terminé, il faut juste mettre l'idJoueur de sa moto à null.
     * - Si la Game n'a pas encore commencé, il faut retirer toute la moto du jeu.
     * Dans tous les cas, on décrémente le nombre de joueurs connectés.
     * @param {String} idPlayer L'id du joueur.
     */
    playerDisconnects(idPlayer) {
        /**
         * On cherche la moto associée à cet idJoueur.
         */
        const moto = this.motos.find(moto => { return moto.idPlayer == idPlayer });
        if (moto == undefined)
            throw "Aucune moto avec le joueurId " + idPlayer + " n'a été trouvée.";

        this.nbPlayers--;
        if (this.hasStarted) {
            /**
             * Alors que le jeu est en cours.
             */
            if (!moto.isDead)
                this.removeMotoFromGrid(moto, null);
            moto.idPlayer = null;
        } else if (this.hasFinished) {
            /**
             * Dans l'ending room.
             */
            if (this.nbPlayers == 0) {
                this.hasFinished = false;
                this.toRemove = true;
            }
            moto.idPlayer = null;
        } else {
            /**
             * Dans la waiting room.
             */
            moto.lost();
            this.motos = this.motos.filter(m => { return m.idPlayer != idPlayer });
        }
    }

    /**
     * Met à jour l'état du jeu.
     */
    update() {
        let jsonToSend = new Object();
        jsonToSend["hasStarted"] = this.hasStarted;
        jsonToSend["hasFinished"] = this.hasFinished;

        if (this.hasStarted) {
            /**
             * On update le jeu en déplaçant les motos non mortes.
             */
            this.motos.filter(m => { return !m.isDead }).forEach(moto => {
                let dir = moto.direction.get();
                if (dir != "START") {
                    /**
                     * La moto se déplace sur une des 4 cases adjacentes en fonction de sa
                     * direction.
                     */
                    let newCell = this.grid.getAdjacentCell(moto.head, dir);
                    /**
                     * Si la nouvelle Cell est hors du cadre (== null) ou si elle appartient
                     * déjà à une moto (que ce soit sa propre propriétaire ou non), alors la
                     * moto a perdu.
                     */
                    if (newCell == null || (newCell != null && newCell.owner != null)) {
                        this.removeMotoFromGrid(moto, newCell);
                    } else {
                        moto.move(newCell);
                    }
                }
            });
            jsonToSend["grid"] = this.grid;
        } else if (this.hasFinished) {
            /**
             * On check le nombre de joueurs restants.
             */
            if (this.nbPlayers == 0)
                this.toRemove = true;
            else
                jsonToSend["motos"] = this.motos;
        } else {
            jsonToSend["players"] = this.nbPlayers;
            jsonToSend["requestedNbPlayers"] = this.requestedNbPlayers;
            jsonToSend["motos"] = this.motos;
        }
        this.sendUpdateToClients(jsonToSend);
    }

    /////////////////////////////COMMUNICATION////CLIENT////////////////////////////////
    /**
     * Envoie un objet à tous les clients connectés à cette Game.
     * @param {Object} obj Les data à envoyer aux clients.
     */
    sendUpdateToClients(obj) {
        const motosWithClient = this.motos.filter(m => { return m.idPlayer != null });
        if (motosWithClient.length > 0) {
            motosWithClient.forEach(moto => {
                //TODO: Send 'obj' to moto.idPlayer.
            });
        }
    }

    /**
     * Serveur reçoit un contrôle de l'utilisateur. Après cela, on vérifie que le
     * client a toujours une moto jouable en jeu.
     * @param {String} idPlayer L'id du client qui envoie au serveur son nouveau
     * contrôle de direction.
     * @param {String} controlKey UP|DOWN|LEFT|RIGHT
     */
    getControlFromClient(idPlayer, controlKey) {
        const moto = this.motos.find(moto => { return moto.idPlayer == idPlayer });
        if (moto != undefined && !moto.isDead)
            moto.direction.changeTo(controlKey);
    }
    ////////////////////////////////////////////////////////////////////////////////////

    /**
     * Retire la Moto du plateau et met à jour les scores. Le score va dépendre
     * de si la moto s'est suicidée dans sa propre trainée ou bien s'il s'agit
     * d'une autre moto qui l'a détruite.
     * @param {Moto} moto La moto à retirer.
     * @param {Cell} cellImpact La cellule où a eu lieu l'impact
     */
    removeMotoFromGrid(moto, cellImpact) {
        moto.lost();
        if (cellImpact != null && cellImpact.owner != moto)
            cellImpact.owner.incrementScore(Config.SCORE_BONUS_FOR_KILL);
        this.grid.cells.forEach(cell => { if (cell.owner == moto) cell.resetOwner(); });
        let survivors = this.motos.filter(m => { return !m.isDead });
        if (survivors.length == 1)
            survivors[0].incrementScore(Config.SCORE_BONUS_FOR_WIN);
        if (survivors.length <= 1)
            this.gameFinished();
    }

    /**
     * La game est finie.
     */
    gameFinished() {
        //TODO: Mettre à jour les scores et le temps de jeu dans la BDD.
        //TODO: Mettre à jour les highest scores des joueurs si nécessaire.
        this.hasStarted = false;
        this.hasFinished = true;
    }

    /**
     * @returns Retourne une cellule de départ qui n'a pas déjà été attribuée.
     */
    getCellStart() {
        for (let i = 0; i < Config.PLAYER_STARTING_COORDS.length; i++) {
            const coords = Config.PLAYER_STARTING_COORDS[i];
            const cell = this.grid.getCell(coords[0], coords[1]);
            if (!cell.hasOwner())
                return cell;
        }
        throw "N'a pas pu récupérer une Cell à attribuer."
    }

    /**
     * @returns Un String représentant une couleur choisie aléatoirement.
     */
    getRandomColor() {
        const colMax = 16777215;
        return "#" + Math.floor(Math.random() * colMax).toString(16).padStart(6, '0').toUpperCase();
    }
}
