// import PathFinding from '../PathFinding/index';
import $ from 'jquery';
import pageActionsLogicAttacher from './Logic';

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
		pageActionsLogicAttacher.attachAlgorithmOptionsShowHideLogic();
		pageActionsLogicAttacher.attachControlCenterSwitchLogic();
		pageActionsLogicAttacher.attachControlBarDragLogic();
		this.renderGrid();
	}

	renderGrid(){
		$('head').append(`<style>
			td{
				width: ${this.nodeSize+'vw'};
				height: ${this.nodeSize+'vw'};
			}
		</style>`);

		const td = (y, x) => {
			let tdElement = $("<td></td>");
			tdElement.data("coords", {x, y});
			tdElement.data("opStack", []);
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

	getTDElemAtXY(x, y){
		return $(this.tableElement.children()[y].children[x]);
	}

	makeWall(x, y){
		this.getTDElemAtXY(x, y).addClass("wallElem");
	}
	
	removeWall(x, y){
		this.getTDElemAtXY(x, y).removeClass("wallElem");
	}

	shiftStartPoint(x, y){
		if(this.startPoint){
			this.getTDElemAtXY(this.startPoint.x, this.startPoint.y).removeClass("startPoint");
			this.startPoint = {x, y};
			this.getTDElemAtXY(x, y).addClass("startPoint");
		} else {
			this.startPoint = {x, y};
			this.getTDElemAtXY(x, y).addClass("startPoint");
		}
	}
	
	shiftEndPoint(x, y){
		if(this.endPoint){
			this.getTDElemAtXY(this.endPoint.x, this.endPoint.y).removeClass("endPoint");
			this.endPoint = {x, y};
			this.getTDElemAtXY(x, y).addClass("endPoint");
		} else {
			this.endPoint = {x, y};
			this.getTDElemAtXY(x, y).addClass("endPoint");
		}
	}

	addOpClassAtXY(x, y, cls){
		let elem = this.getTDElemAtXY(x, y);
		let elemOpStack = elem.data("opStack");
		elemOpStack.push(cls.toUpperCase());
		elem.addClass(cls.toUpperCase());
	}

	popOpClassAtXY(x, y){
		let elem = this.getTDElemAtXY(x, y);
		let opStack = elem.data("opStack");
		let clsToRm = opStack.pop();
		if(clsToRm){
			elem.removeClass(clsToRm);
		}
	}
}

export default ViewRenderer;
