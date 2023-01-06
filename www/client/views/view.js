const connectionDOM = document.getElementById("connection");
const waitingDOM = document.getElementById("waiting");
const gridDOM = document.getElementById("grid");
const endingDOM = document.getElementById("ending");

function repaintDivAccordingToOwner(div, owner) {
    if (owner != null)
        div.style.backgroundColor = owner.color;
}

function showView(view) {
    connectionDOM.style.display = view == "CONNECTION" ? "flex" : "none";
    waitingDOM.style.display = view == "WAITING" ? "flex" : "none";
    gridDOM.style.display = view == "GRID" ? "flex" : "none";
    endingDOM.style.display = view == "ENDING" ? "flex" : "none";
}
