let rows=50, coulmns=50;
let grid = new PathFinding.Grid(rows, coulmns);
var table = $("#grid");
var initial = 0;

table.on('dragover', (event) => {
	grid.invertIntensity(initial, $(event.target));
});
table.on('click', (event) => {
	grid.invertIntensity(initial, $(event.target));
});
table.on('dragstart', (event) => {
	const {x, y} = $(event.target).data("coords");
	initial = grid.matrix[y][x];
	grid.invertIntensity(initial, $(event.target));
});

const td = (y, x) => {
	let tdElem = $("<td draggable='true'></td>");
	tdElem.data("coords", {x, y});
	tdElem.width(100/coulmns+'vw');
	tdElem.height(100/coulmns+'vw');
	return tdElem;
};

for (let i = 1; i <= rows; i++) {
	var tr = $("<tr>");
	for(let j = 1; j<= coulmns; j++){
		tr.append(td(i, j));
	}
	table.append(tr);
}
