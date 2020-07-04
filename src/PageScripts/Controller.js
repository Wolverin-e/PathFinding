import PathFinding from '../PathFinding/index';
import $ from 'jquery';
import StateMachine from 'javascript-state-machine';

const stateMachineData = {
	init: 'steady', 
	transitions: [
		{
			name: 'initialize', 
			from: 'steady', 
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
			name: 'startShiftingEndPoint', 
			from: 'Editing', 
			to: 'ShiftingEndPoint'
		}, 
		{
			name: 'startRemovingWalls', 
			from: 'Editing', 
			to: 'RemovingWalls'
		}, 
		{
			name: 'startShiftingStartPoint', 
			from: 'Editing', 
			to: 'ShiftingStartPoint'
		}, 
		{
			name: 'goBackToEditing', 
			from: ['AddingWalls', 'RemovingWalls', 'ShiftingStartPoint', 'ShiftingEndPoint'], 
			to: 'Editing'
		}
	]
};

class Controller extends StateMachine{
	constructor(options){
		super(stateMachineData);
		this.viewRenderer = options.viewRenderer;
		this.rows = options.rows;
		this.columns = options.columns;
		
		this.grid = new PathFinding.Grid({
			rows: this.rows, 
			columns: this.columns, 
			startPoint: options.startPoint, 
			endPoint: options.endPoint
		});
	}

	makeTransitionFromEventHook(transition){
		return setTimeout(() => {
			this[transition]();
		}, 0);
	}

	onAfterInitialize(){
		this.viewRenderer.init();
		this.shiftStartPoint(this.grid.startPoint.x, this.grid.startPoint.y);
		this.shiftEndPoint(this.grid.endPoint.x, this.grid.endPoint.y);
		this.makeTransitionFromEventHook("edit");
		this.bindEventListeners();
	}

	makeWall(x, y){
		if(this.grid.isXYStartPoint(x, y)) return;
		if(this.grid.isXYEndPoint(x, y)) return;
		this.grid[y][x] = 1;
		this.viewRenderer.makeWall(x, y);
	}

	removeWall(x, y){
		if(this.grid.isXYStartPoint(x, y)) return;
		if(this.grid.isXYEndPoint(x, y)) return;
		this.grid[y][x] = 0;
		this.viewRenderer.removeWall(x, y);
	}

	shiftStartPoint(x, y){
		if(this.grid.isXYWallElement(x, y)) return;
		if(this.grid.isXYEndPoint(x, y)) return;
		this.grid.startPoint = {x, y};
		this.viewRenderer.shiftStartPoint(x, y);
	}

	shiftEndPoint(x, y){
		if(this.grid.isXYWallElement(x, y)) return;
		if(this.grid.isXYStartPoint(x, y)) return;
		this.grid.endPoint = {x, y};
		this.viewRenderer.shiftEndPoint(x, y);
	}

	bindEventListeners(){
		this.viewRenderer.tableElement.on('mousedown', (event) => {
			const {x, y} = $(event.target).data("coords");
			if(this.is('Editing')){
				if(this.grid.isXYStartPoint(x, y)){
					this.startShiftingStartPoint();
					return;
				}

				if(this.grid.isXYEndPoint(x, y)){
					this.startShiftingEndPoint();
					return;
				}

				if(this.grid.isXYWallElement(x, y)){
					this.startRemovingWalls();
					this.removeWall(x, y);
				} else {
					this.startAddingWalls();
					this.makeWall(x, y);
				}
			}
		});

		this.viewRenderer.tableElement.on('mouseover', (event) => {
			if(!$(event.target).is('td')) return;
			let {x, y} = $(event.target).data("coords");
			
			switch(this.state){
				case 'AddingWalls':
					this.makeWall(x, y);
					break;
				case 'RemovingWalls':
					this.removeWall(x, y);
					break;
				case 'ShiftingStartPoint':
					this.shiftStartPoint(x, y);
					break;
				case 'ShiftingEndPoint':
					this.shiftEndPoint(x, y);
					break;
				default:
					break;
			}
		});

		this.viewRenderer.tableElement.on('mouseup', () => {
			if(this.can('goBackToEditing')){
				this.goBackToEditing();
			}
		});
	}
}

export default Controller;
