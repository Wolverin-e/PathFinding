import PathFinding from '../PathFinding/index';
import $ from 'jquery';
import StateMachine from 'javascript-state-machine';

let controllerStateMachine = new StateMachine({
	init: 'Initializing', 
	transitions: [
		{
			name: 'startRendering', 
			from: 'Initializing', 
			to: 'Rendering'
		}, 
		{
			name: 'edit', 
			from: 'Rendering', 
			to: 'Editing'
		}, 
		{
			name: 'startAddingWalls', 
			from: 'Editing', 
			to: 'AddingWalls'
		}, 
		{
			name: 'stopAddingWalls', 
			from: 'AddingWalls', 
			to: 'Editing'
		}, 
		{
			name: 'startRemovingWalls', 
			from: 'Editing', 
			to: 'RemovingWalls'
		}, 
		{
			name: 'stopRemovingWalls', 
			from: 'RemovingWalls', 
			to: 'Editing'
		}, 
		{
			name: 'startShiftingStartPoint', 
			from: 'Editing', 
			to: 'ShiftingStartPoint'
		}, 
		{
			name: 'stopShiftingStartPoint', 
			from: 'ShiftingStartPoint', 
			to: 'Editing'
		}, 
		{
			name: 'startShiftingEndPoint', 
			from: 'Editing', 
			to: 'ShiftingEndPoint'
		}, 
		{
			name: 'stopShiftingEndPoint', 
			from: 'ShiftingEndPoint', 
			to: 'Editing'
		}
	], 
	methods: {
	}
});


class Controller{
	constructor(options){
		this.viewRenderer = options.viewRenderer;
		this.rows = options.rows;
		this.columns = options.columns;

		this.grid = new PathFinding.Grid({
			rows: this.rows, 
			columns: this.columns
		});

		this.startPoint = {
			x: 10, 
			y: 10
		};

		this.endPoint = {
			x: 30, 
			y: 10
		};
	}

	init(){
		controllerStateMachine.startRendering();
		this.viewRenderer.init();
		this.shiftStartPoint(this.startPoint.x, this.startPoint.y);
		this.shiftEndPoint(this.endPoint.x, this.endPoint.y);
		controllerStateMachine.edit();
		this.bindEventListeners();
	}

	makeWall(x, y){
		this.grid[y][x] = 1;
		this.viewRenderer.makeWall(x, y);
	}

	removeWall(x, y){
		this.grid[y][x] = 0;
		this.viewRenderer.removeWall(x, y);
	}

	shiftStartPoint(x, y){
		this.startPoint = {x, y};
		this.viewRenderer.shiftStartPoint(x, y);
	}
	
	shiftEndPoint(x, y){
		this.endPoint = {x, y};
		this.viewRenderer.shiftEndPoint(x, y);
	}

	isStartPoint(x, y){
		return ((this.startPoint.x === x )&&(this.startPoint.y === y));
	}
	
	isEndPoint(x, y){
		return ((this.endPoint.x === x )&&(this.endPoint.y === y));
	}

	bindEventListeners(){
		this.viewRenderer.tableElement.on('mousedown', (event) => {
			let coords = $(event.target).data("coords");
			if(controllerStateMachine.is('Editing')){
				if(this.isStartPoint(coords.x, coords.y)){
					controllerStateMachine.startShiftingStartPoint();
				} else if(this.isEndPoint(coords.x, coords.y)){
					controllerStateMachine.startShiftingEndPoint();
				} else {
					if(this.grid[coords.y][coords.x]){
						controllerStateMachine.startRemovingWalls();
						this.removeWall(coords.x, coords.y);
					} else {
						controllerStateMachine.startAddingWalls();
						this.makeWall(coords.x, coords.y);
					}
				}
			}
		});

		this.viewRenderer.tableElement.on('mouseover', (event) => {
			let coords = $(event.target).data("coords");
			if(controllerStateMachine.is('AddingWalls')){
				this.makeWall(coords.x, coords.y);
			}
			if(controllerStateMachine.is('RemovingWalls')){
				this.removeWall(coords.x, coords.y);
			}
			if(controllerStateMachine.is('ShiftingStartPoint')){
				this.shiftStartPoint(coords.x, coords.y);
			}
			if(controllerStateMachine.is('ShiftingEndPoint')){
				this.shiftEndPoint(coords.x, coords.y);
			}
		});

		this.viewRenderer.tableElement.on('mouseup', () => {
			if(controllerStateMachine.is('AddingWalls')){
				controllerStateMachine.stopAddingWalls();
			} else if(controllerStateMachine.is('RemovingWalls')){
				controllerStateMachine.stopRemovingWalls();
			} else if(controllerStateMachine.is('ShiftingStartPoint')){
				controllerStateMachine.stopShiftingStartPoint();
			} else if(controllerStateMachine.is('ShiftingEndPoint')){
				controllerStateMachine.stopShiftingEndPoint();
			}
		});
	}
}

export default Controller;
