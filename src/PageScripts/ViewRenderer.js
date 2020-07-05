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
		this.bindControlCenterSwitchLogic();
		this.bindAlgorithmOptionsShowHideLogic();
		this.bindControlBarDragLogic();
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

	bindControlCenterSwitchLogic(){
		const controlCenterSwitch = $("#control-center-switch");
		const expandImage = controlCenterSwitch.find("img");
		const controlCenter = $("#control-center");
		const controlCenterWidth = "250px";
		const negControlCenterWidth = '-'+controlCenterWidth;
		let switchState = "closed";

		controlCenter.css("left", negControlCenterWidth);
		controlCenter.width(controlCenterWidth);
		
		controlCenterSwitch.on('click', () => {
			if(switchState === "closed"){
				expandImage.css("transform", "rotate(180deg)");
				controlCenterSwitch.css("left", controlCenterWidth);
				controlCenter.css("left", "0px");
				switchState = "open";
			} else {
				expandImage.css("transform", "rotate(0deg)");
				controlCenter.css("left", negControlCenterWidth);
				controlCenterSwitch.css("left", "-6px");
				switchState = "closed";
			}
		});
	}

	bindControlBarDragLogic(){
		const controlBar = $("#control-bar");
		const draggable = $(controlBar.find("#drag"));
		
		let mouseDownOnDraggable = false;
		let startCoords = {};

		controlBar.find("img").each((i, img) => {
			$(img).on("dragstart", () => {
				event.preventDefault();
			});
		});

		draggable.on("mousedown", (event) => {
			mouseDownOnDraggable = true;
			startCoords.x = event.clientX;
			startCoords.y = event.clientY;
		});
		
		draggable.on("mouseup", () => {
			mouseDownOnDraggable = false;
		});

		document.onmousemove = (event) => {
			if(mouseDownOnDraggable){
				let x = event.clientX;
				let y = event.clientY;
				let delLeft = startCoords.x - x;
				let delTop = startCoords.y - y;

				startCoords = {x, y};
				let curOff = controlBar.offset();
				controlBar.offset({
					left: curOff.left-delLeft, 
					top: curOff.top-delTop
				});
			}
		};
	}

	bindAlgorithmOptionsShowHideLogic(){
		const controlCenter = $("#control-center");
		const algorithmSelector = controlCenter.find("#algorithmSelector");
		
		controlCenter.find(".algorithm-options-section").hide();
		let current = algorithmSelector.val();
		controlCenter.find("#"+current).show();
		
		algorithmSelector.on("change", (event) => {
			controlCenter.find("#"+current).hide();
			current = event.target.value;
			controlCenter.find("#"+current).show();
		});
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
