import $ from 'jquery';
import StateMachine from 'javascript-state-machine';

import PathFinding from '../PathFinding/index';
import stateMachineData from './ControllerStates';


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

		this.algorithm = "BreadthFirstSearch";
		this.algorithmOptions = {
			allowDiagonal: true
		};
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
		this.bindGridEventListeners();
		this.bindControlCenterEventListeners();
		this.bindControlBarEventListeners();
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

	bindGridEventListeners(){
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

	bindControlCenterEventListeners(){
		let controlCenter = $('#control-center');

		controlCenter.find("#algorithmSelector").on('change', (event) => {
			this.algorithm = event.target.value;
			this.algorithmOptions = {};

			let radioOpt = controlCenter.find(`#${this.algorithm} .options-radio-section input[type='radio']:checked`);
			if(radioOpt.length) this.algorithmOptions['heuristic'] = radioOpt.val();
			
			let checkBoxOpts = controlCenter.find(`#${this.algorithm} .options-checkbox-section input[type='checkbox']:checked`);
			if(checkBoxOpts.length){
				checkBoxOpts.each((i, elem) => {
					this.algorithmOptions[elem.value] = true;
				});
			}
		});

		controlCenter.find(`.options-radio-section input[type='radio']`).each((i, elem) => {
			$(elem).on("click", (event) => {
				this.algorithmOptions.heuristic = event.target.value;
			});
		});
		
		controlCenter.find(`.options-checkbox-section input[type='checkbox']`).each((i, elem) => {
			$(elem).on("click", (event) => {
				this.algorithmOptions[event.target.value] = this.algorithmOptions[event.target.value]?false:true;
			});
		});
	}

	bindControlBarEventListeners(){
		let controlBar = $('#control-bar');
		controlBar.find('#start').on("click", () => {
			console.log("start");
		});
		controlBar.find('#pause').on("click", () => {
			console.log("pause");
		});
		controlBar.find('#resume').on("click", () => {
			console.log("resume");
		});
		controlBar.find('#stop').on("click", () => {
			console.log("stop");
		});
		controlBar.find('#step').on("click", () => {
			console.log("step");
		});
	}
}

export default Controller;
