///////////////////ENDING////VIEW///////////////////
function drawEndingRoom(names, cols, scores) {
    showView("ENDING");

    var tBody = document.getElementById("scoreBoardBody");

    for(let i = 0; i<names.length;i++){
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");

        let player = document.createTextNode(""+names[i]);
        let score = document.createTextNode(""+scores[i]);
        cell1.style.color=cols[i]

        cell1.appendChild(player);
        cell2.appendChild(score);
        row.appendChild(cell1);
        row.appendChild(cell2)
        tBody.appendChild(row);
    }
}

function emptyScoreBoard() {
    var tBody = document.getElementById("scoreBoardBody");
    while (tBody.lastElementChild)
        tBody.removeChild(tBody.lastElementChild);
}


////////////////////////////////////////////////////