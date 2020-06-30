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
			let tdElement = $("<td></td>");
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
	
	removeWall(x, y){
		$(this.tableElement.children()[y].children[x]).removeClass("wallElem");
	}

	shiftStartPoint(x, y){
		if(this.startPoint){
			$(this.tableElement.children()[this.startPoint.y].children[this.startPoint.x]).removeClass("startPoint");
			this.startPoint = {x, y};
			$(this.tableElement.children()[y].children[x]).addClass("startPoint");
		} else {
			this.startPoint = {x, y};
			$(this.tableElement.children()[y].children[x]).addClass("startPoint");
		}
	}
	
	shiftEndPoint(x, y){
		if(this.endPoint){
			$(this.tableElement.children()[this.endPoint.y].children[this.endPoint.x]).removeClass("endPoint");
			this.endPoint = {x, y};
			$(this.tableElement.children()[y].children[x]).addClass("endPoint");
		} else {
			this.endPoint = {x, y};
			$(this.tableElement.children()[y].children[x]).addClass("endPoint");
		}
	}
}

export default ViewRenderer;
