// import PathFinding from '../PathFinding/index';
import $ from 'jquery';

class ViewRenderer{
	constructor(options){
		this.rows = options.rows;
		this.columns = options.columns;
		this.tableSelector = options.tableSelector;
		
		// PROCESSING
		this.tableElement = $(this.tableSelector);
		this.nodeSize = 100/this.columns; //in vw
	}
	
	init(){
		this.renderGrid();
	}

	renderGrid(){
		const td = (y, x) => {
			let tdElement = $("<td draggable='true'></td>");
			tdElement.width(this.nodeSize+'vw');
			tdElement.height(this.nodeSize+'vw');
			tdElement.data("coords", {x, y});
			return tdElement;
		};

		for (let y = 0; y < this.rows; y++) {
			var tr = $("<tr>");
			for(let x = 0; x < this.columns; x++){
				tr.append(td(y, x));
			}
			this.tableElement.append(tr);
		}
	}

	convertToXY(pageX, pageY){
		let nodeSizeInPx = document.documentElement.clientWidth/this.columns;
		return {
			x: Math.floor(pageX/nodeSizeInPx),
			y: Math.floor(pageY/nodeSizeInPx)
		};
	}

	makeWall(x, y){
		$(this.tableElement.children()[y].children[x]).addClass("wallElem");
	}
}

export default ViewRenderer;
