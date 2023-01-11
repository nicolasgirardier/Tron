////////////////////GRID////VIEW////////////////////
function repaintDiv(div, col) {
    if (col != null)
        div.style.backgroundColor = col;
}

function drawGrid(grid) {
    showView("GRID");
    gridDOM.style.gridTemplateRows = "repeat(" + grid.height + ", 1fr)";
    gridDOM.style.gridTemplateColumns = "repeat(" + grid.width + ", 1fr)";

    grid.cells.forEach(cell => {
        const div = document.createElement("div");
        gridDOM.appendChild(div);
        repaintDiv(div, cell.col);
    });
}

function repaintGrid(grid) {
    grid.cells.forEach((cell, index) => {
        const div = gridDOM.children[index];
        repaintDiv(div, cell.col);
    });
}
////////////////////////////////////////////////////