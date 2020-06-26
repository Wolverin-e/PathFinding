class Grid{
    constructor(i, j){
        this.matrix = [];
        for(let i=1; i<100; i++){
            this.matrix[i] = []
            for(let j=1; j<100; j++){
                this.matrix[i][j] = 0;
            }
        }
    }

    changeIntensity(i, j, table){
        this.matrix[i][j] = 1;
        $(table.children()[i-1].children[j-1]).css("background-color", "black")
    }
}
let rows=100, coulmns=100;

let grid = new Grid(rows, coulmns);
var table = $("#grid");

const td = (y, x) => {
    let tdElem = $("<td draggable='true'></td>");
    tdElem.data("coords", {x, y});
    tdElem.width(100/coulmns+'vw');
    tdElem.height(100/coulmns+'vw');
    tdElem.on('dragover', (event) => {
        // let data = $(event.currentTarget).data("coords");
        grid.changeIntensity(y, x, table);
    })
    return tdElem;
}

for (let i = 1; i <= rows; i++) {
    var tr = $("<tr>");
    for(let j = 1; j<= coulmns; j++){
        tr.append(td(i, j));
    }
    table.append(tr);
}