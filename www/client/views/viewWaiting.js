///////////////////WAITING////VIEW//////////////////
function drawWaitingRoom(players, requestedNbPlayers, names, cols) {
    showView("WAITING");
    let pm = document.getElementById("playersMissing");
    pm.innerHTML= "players missing : "+ (requestedNbPlayers - players);
    let table = document.getElementById("players");
    

    for(let i = 0; i<players;i++){
        let row = document.createElement("tr");
        let cellID = document.createElement("td");
        let cellCol = document.createElement("td");
        let idPlayer = document.createTextNode(names[i]+"'s");
        let colPlayer = document.createTextNode("color");
        cellID.setAttribute("class", "cellID");
        cellID.appendChild(idPlayer);
        cellCol.appendChild(colPlayer);
        cellCol.style.color=cols[i];
        row.appendChild(cellID);
        row.appendChild(cellCol);
        table.appendChild(row);
    }
}

function emptyPlayersTable() {
    console.log("supprimer tout");
    let table = document.getElementById("players");
    let pm = document.getElementById("playersMissing");
    while (table.lastElementChild)
        table.removeChild(table.lastElementChild);
}
////////////////////////////////////////////////////