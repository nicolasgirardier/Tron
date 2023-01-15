/**
 * Configurations du jeu.
 */
class Config {
    /**
     * Largeur de la grille.
     */
    static GRID_WIDTH = 50;

    /**
     * Hauteur de la grille.
     */
    static GRID_HEIGHT = 50;

    /**
     * Nombre de joueurs requis.
     */
    static NB_REQUIRED_PLAYERS = 3;

    /**
     * Coordonnées de départ d'un joueur.
     */
    static PLAYER_STARTING_COORDS = [
        [1, 1],
        [Config.GRID_WIDTH - 2, Config.GRID_HEIGHT - 2],
        [Config.GRID_WIDTH - 2, 1],
        [1, Config.GRID_HEIGHT - 2],
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
class Player {
    /**
     * @param {String} id L'id du joueur
     * @param {connection} con L'objet de connection associé à ce joueur
     */
    constructor(id, con) {
        this.id = id;
        this.con = con;
    }
}
/**
 * Décrit une direction pour une moto. Elle est constituée de 4 attributs.
 * Un seul peut être évalué à true. Au départ, ils sont tous évalués à false.
 */
class DirectionMoto {
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
/**
 * Décrit une cellule de la grille.
 */
class Cell {
    /**
     * À l'initialisation, la Cell n'a pas de couleur.
     * @param {Integer} x Coordonnée x de la Cell.
     * @param {Integer} y Coordonnée y de la Cell.
     * @param {String} col La couleur de la moto présente sur cette Cell.
     */
    constructor(x, y, col = "rgba(255, 255, 255, 0)") {
        this.x = x;
        this.y = y;
        this.col = col;
    }

    /**
     * Indique si la Cell a une couleur.
     * @returns true si la Cell a une couleur, false sinon.
     */
    hasColor() {
        return this.col != "rgba(255, 255, 255, 0)";
    }

    /**
     * Définit la couleur de cette Cell. 
     * @param {String} col La couleur de la moto qui vient occuper cette Cell.
     */
    setColor(col) {
        this.col = col;
    }

    /**
     * Redéfinit cette Cell comme n'ayant pas de couleur.
     */
    resetColor() {
        this.col = "rgba(255, 255, 255, 0)";
    }
}
/**
 * Une moto jouée par un joueur.
 */
class Moto {
    /**
     * @param {Player} player Le joueur qui joue cette moto.
     * @param {Cell} startCell La Cell de départ de la moto.
     * @param {String} color La couleur utilisée pour dessiner la moto.
     */
    constructor(player, startCell, color) {
        this.player = player;
        this.name = player.id;

        this.color = color;
        this.isDead = false;
        this.score = 0;

        this.direction = new DirectionMoto();
        this.head = null;
        this.move(startCell);
    }

    /**
     * Déplace cette moto sur la Cell en paramètre. Doit être différente
     * de null. Met à jour le score pour avoir effectué un déplacement.
     * @param {Cell} cell La nouvelle position de la moto.
     */
    move(cell) {
        this.head = cell;
        cell.setColor(this.color);
        this.incrementScore(Config.SCORE_BONUS_FOR_MOVE);
    }

    /**
     * Cette moto a perdu.
     */
    lost() {
        this.head.resetColor();
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
        return this.cells.filter(cell => { return cell.x == x && cell.y == y })[0];
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
         * La game a besoin d'être mise à jour.
         */
        this.requestUpdate = true;

        this.nbUpdate = 0;
        this.nbUpdateBeforeGo = 20;

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
     * @param {Player} player Le joueur.
     */
    playerConnects(player) {
        this.nbPlayers++;

        let newMoto = new Moto(player, this.getCellStart(), this.getRandomColor());
        this.motos.push(newMoto);
    }

    /**
     * Retire un joueur de la Game. Pour cela, il faut mettre à jour l'attribut de la
     * moto qu'il jouait. Les actions sont différentes selon l'état actuel de la Game. 
     * - Si la Game a commencé, il faut faire perdre le joueur puis mettre le joueur
     * de sa moto à null (cela traduit le fait que plus aucun joueur ne joue cette moto.)
     * - Si la Game a terminé, il faut juste mettre le joueur de sa moto à null.
     * - Si la Game n'a pas encore commencé, il faut retirer tout l'objet moto du jeu.
     * Dans tous les cas, on décrémente le nombre de joueurs connectés.
     * @param {Player} player L'id du joueur.
     */
    playerDisconnects(player) {
        const moto = this.motos.find(m => { return m.player != null ? m.player.id == player.id : false });
        if (moto == undefined)
            throw "Aucune moto avec le joueurId " + player.id + " n'a été trouvée.";

        this.nbPlayers--;
        if (this.hasStarted) {
            /**
             * Alors que le jeu est en cours.
             */
            if (!moto.isDead)
                this.removeMotoFromGrid(moto, null);
            moto.player = null;
        } else if (this.hasFinished) {
            /**
             * Dans l'ending room.
             */
            if (this.nbPlayers == 0) {
                this.hasFinished = false;
                this.toRemove = true;
            }
            moto.player = null;
        } else {
            /**
             * Dans la waiting room.
             */
            this.motos = this.motos.filter(m => { return m.player.id != player.id });
        }
    }

    /**
     * Met à jour l'état du jeu.
     */
    update() {
        if (this.nbPlayers == this.requestedNbPlayers) {
            if (this.nbUpdate == this.nbUpdateBeforeGo && !this.hasStarted) {
                this.hasStarted = true;
            } else {
                this.nbUpdate++;
            }
        }
            
        /**
         * jsonToSend est l'objet JSON à envoyer aux clients. Qqsoit l'état du jeu, il est
         * toujours composé de ces deux booléens qui indiquent l'état actuel du jeu. Ils
         * servent notamment au client pour déterminer quelle vue retourner.
         */
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
                    if (newCell == null || (newCell != null && newCell.hasColor())) {
                        this.removeMotoFromGrid(moto, newCell);
                    } else {
                        moto.move(newCell);
                    }
                }
            });
            /**
             * Lorsque le jeu est en cours, on choisit d'ajouter au JSON la grille de jeu, pour
             * repeindre les cases.
             */
            jsonToSend["grid"] = this.grid;
        } else if (this.hasFinished) {
            /**
             * Si le jeu a terminé, on check le nombre de joueurs restants. S'il reste des joueurs
             * dans la vue de "game over", on renvoie les motos pour afficher notamment les noms des
             * joueurs, la couleur qu'ils jouaient au cours de la partie ainsi que leur score.
             */
            if (this.nbPlayers == 0)
                this.toRemove = true;
            else {
                let names = [], cols = [], scores = [];
                this.motos.forEach(m => {
                    names.push(m.name);
                    cols.push(m.color);
                    scores.push(m.score);
                })
                jsonToSend["names"] = names;
                jsonToSend["cols"] = cols;
                jsonToSend["scores"] = scores;
                this.sendUpdateToClients(jsonToSend);
                this.requestUpdate = false;
                return;
            }

        } else {
            /**
             * Tant que la game est en attente, on envoie avec le JSON des données comme le nombre
             * de joueurs connectés sur le nombre de joueurs requis, ainsi que les noms des joueurs
             * déjà connectés et leur couleur.
             */
            let names = [], cols = [];
            this.motos.forEach(m => {
                names.push(m.name);
                cols.push(m.color);
            })
            jsonToSend["players"] = this.nbPlayers;
            jsonToSend["requestedNbPlayers"] = this.requestedNbPlayers;
            jsonToSend["names"] = names;
            jsonToSend["cols"] = cols;
        }

        /**
         * A chaque update, on envoie le JSON au client.
         */
        this.sendUpdateToClients(jsonToSend);
    }

    /////////////////////////////COMMUNICATION////CLIENT////////////////////////////////
    /**
     * Envoie un objet à tous les clients connectés à cette Game.
     * @param {Object} obj Les data à envoyer aux clients.
     */
    sendUpdateToClients(obj) {
        const motosWithClient = this.motos.filter(m => { return m.player != null });
        if (motosWithClient.length > 0) {
            motosWithClient.forEach(moto => {
                const con = moto.player.con;
                con.send(JSON.stringify(obj));
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
    getControlFromClient(moto, controlKey) {
        if (!moto.isDead)
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

        if (cellImpact != null && cellImpact.col != moto.color) {
            /**
             * Récupère la moto qui a cette couleur pour lui ajouter du score.
             */
            let owner = this.motos.find(m => { return m.color == cellImpact.col });
            owner.incrementScore(Config.SCORE_BONUS_FOR_KILL);
        }

        this.grid.cells.forEach(cell => { if (cell.col == moto.color) cell.resetColor(); });

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
            if (!cell.hasColor())
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
/**
 * gameWaiting et gamesPlaying contiennent des objets Games.
 * gameWaiting est la Game en attente de joueurs. Il ne peut y en avoir 
 * qu'une.
 * gamesPlaying est l'array des Game en cours.
 */
let gameWaiting = null;
const gamesPlaying = [];

function joueurConnecte(idPlayer, con) {
    //TODO: vérifier que le joueur n'est pas connecté
    //TODO: met à jour la BDD.
    let player = new Player(idPlayer, con);

    /**
     * Si une game est en attente de joueurs (gameWaiting != null), on fait
     * se connecter le joueur à cette Game.
     */
    if (gameWaiting != null) {
        gameWaiting.playerConnects(player);
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
        gameWaiting.playerConnects(player);
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
        else if (game.requestUpdate)
            game.update();
    })
}

setInterval(updateGames, 200);

///////////////////// LE SERVEUR ////////////////////////////
const http = require('http');
const server = http.createServer();
server.listen(9898); // On écoute sur le port 9898

console.log("server running on port 9898");
// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});

/*const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('Tron');
const collection = db.collection('players');
const result = collection.insertOne("A");*/

// Si erreur quand vous exécutez le serveur, commentez les lignes qui suivent
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Nikoto:2470NicolasG@cluster0.e5ssyqv.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect();
// const collection = client.db("Tron").collection("Players");
//collection.insertOne({ idPlayer: "A"}) exemple d'insertion dans la collection "Players"

let ids = [];
// Mise en place des événements WebSockets
wsServer.on('request', function (request) {
    console.log("Requête reçue");

    const connection = request.accept(null, request.origin);

    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', function (message) {

        const json = JSON.parse(message.utf8Data);
        let id = json.object.id;
        connection.id = id;

        // Si le client essaye de se connecter
        if (json.status == "connection") {
            if (!ids.includes(connection.id)) {
                ids.push(id);
                joueurConnecte(id, connection);
            } else {
                let obj = {
                    invalidConnection: true,
                };
                connection.send(JSON.stringify(obj));
            }
        } else {
            let gamemoto = getGameMoto(id);
            let game = gamemoto[0];
            let moto = gamemoto[1];

            if (json.status == "sendControl") {
                let key = json.object.key;
                game.getControlFromClient(moto, key);
            }
            else if (json.status == "disconnects") {
                game.playerDisconnects(moto.player);
                removeConnection(connection);
            }
        }


    });

    connection.on('close', function (reasonCode, description) {
        if (connection.id != undefined) {
            let gamemoto = getGameMoto(connection.id);
            let game = gamemoto[0];
            let moto = gamemoto[1];
            game.playerDisconnects(moto.player);

            removeConnection(connection);
            console.log((new Date()) + ' Peer ' + connection.id + ' disconnected.')
        }
    });
});

/**
 * Retire l'id contenu dans la connection de la liste d'ids.
 * @param {String} connection L'id du joueur qui dispose de la connection.
 */
function removeConnection(connection) {
    if (connection.id != null) {
        const index = ids.indexOf(connection.id);
        if (index != -1)
            ids.splice(index, 1);
    }
    console.log("current connections -> " + ids);
}

/**
 * Get la game et la moto du joueur en paramètre s'il en a.
 * @param {String} id L'id du joueur
 * @returns Array d'une game et d'une moto.
 */
function getGameMoto(id) {
    let game, moto;
    for (let i = 0; i < gamesPlaying.length; i++) {
        game = gamesPlaying[i];
        moto = game.motos.find(m => { return m.player != null ? m.player.id == id : false });
        if (moto != undefined)
            return [game, moto];
    }
    moto = gameWaiting.motos.find(m => { return m.player != null ? m.player.id == id : false });
    if (moto != undefined)
        return [gameWaiting, moto];
}