import $ from 'jquery';
import pageActionsLogicAttacher from './Logic';

// Adding New Function
Array.prototype.peek = function(){
	return this.length?this[this.length-1]:undefined;
};

class ViewRenderer{
	constructor(options){
		this.rows = options.rows;
		this.columns = options.columns;

		// PROCESSING
		this.tableElement = $("#grid");
		this.nodeSize = 100/this.columns; //in vw
	}

	init(){
		pageActionsLogicAttacher.attachControlCenterSwitchLogic();
		pageActionsLogicAttacher.attachAlgorithmOptionsShowHideLogic();
		pageActionsLogicAttacher.attachControlBarDragLogic();
		pageActionsLogicAttacher.attachDarkModeLogic();
		pageActionsLogicAttacher.showUsageLink();
		this.renderGrid();
		$("#loader").hide();
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
		// this.getTDElemAtXY(x, y).addClass("wallElem");
		this.addOpClassAtXY(x, y, "wallElem");
	}

	removeWall(x, y){
		// this.getTDElemAtXY(x, y).removeClass("wallElem");
		this.popOpClassAtXY(x, y, "wallElem");
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
		let opStack = elem.data("opStack");
		if(opStack.peek()){
			elem.removeClass(opStack.peek());
		}
		opStack.push(cls.toUpperCase());
		elem.addClass(cls.toUpperCase());
	}

	popOpClassAtXY(x, y){
		let elem = this.getTDElemAtXY(x, y);
		let opStack = elem.data("opStack");
		if(opStack.peek()){
			elem.removeClass(opStack.pop());
		}
		if(opStack.peek()){
			elem.addClass(opStack.peek());
		}
	}
}

export default ViewRenderer;
