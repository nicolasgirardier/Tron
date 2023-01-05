////////////////////GRID////VIEW////////////////////
function drawGrid(grid) {
    showView("GRID");
    gridDOM.style.gridTemplateRows = "repeat(" + grid.height + ", 1fr)";
    gridDOM.style.gridTemplateColumns = "repeat(" + grid.width + ", 1fr)";

    grid.cells.forEach(cell => {
        const div = document.createElement("div");
        repaintDivAccordingToOwner(div, cell.owner);
    });
}

function repaintGrid(grid) {
    grid.cells.forEach((cell, index) => {
        const div = gridDOM.children[index];
        repaintDivAccordingToOwner(div, cell.owner);
    });
}
////////////////////////////////////////////////////