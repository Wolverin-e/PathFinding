class Grid{
    constructor(rows, cols){
        this.matrix = [];
        for(let i=1; i<rows; i++){
            this.matrix[i] = []
            for(let j=1; j<cols; j++){
                this.matrix[i][j] = 0;
            }
        }
    }

    changeIntensity(i, j, table){
        this.matrix[i][j] = 1;
        // $(table.children()[i-1].children[j-1]).css("background-color", "black")
        $(table.children()[i-1].children[j-1]).addClass("wallElem");
    }

    invertIntensity(initial, target){
        const {x, y} = target.data("coords");
        if(initial){
            this.matrix[y][x] = 0;
            target.removeClass("wallElem");
        } else {
            this.matrix[y][x] = 1;
            target.addClass("wallElem");
        }
    }
}


let rows=50, coulmns=50;
let grid = new Grid(rows, coulmns);
var table = $("#grid");
var initial = 0;

table.on('dragover', (event) => {
    grid.invertIntensity(initial, $(event.target));
})
table.on('click', (event) => {
    grid.invertIntensity(initial, $(event.target));
})
table.on('dragstart', (event) => {
    const {x, y} = $(event.target).data("coords");
    initial = grid.matrix[y][x];
    grid.invertIntensity(initial, $(event.target));
})

const td = (y, x) => {
    let tdElem = $("<td draggable='true'></td>");
    tdElem.data("coords", {x, y});
    tdElem.width(100/coulmns+'vw');
    tdElem.height(100/coulmns+'vw');
    return tdElem;
}

for (let i = 1; i <= rows; i++) {
    var tr = $("<tr>");
    for(let j = 1; j<= coulmns; j++){
        tr.append(td(i, j));
    }
    table.append(tr);
}