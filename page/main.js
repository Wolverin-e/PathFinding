var table = $("#grid");

let rows=10,coulmns=10;

const td = (x, y) => {
    let tdElem = $("<td>");
    tdElem.data("coords", {x, y});

    tdElem.on('click', (event) => {
        let data = $(event.currentTarget).data("coords");
        console.log(data);
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