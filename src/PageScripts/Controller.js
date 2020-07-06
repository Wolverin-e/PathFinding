import $ from 'jquery';
import StateMachine from 'javascript-state-machine';

import PathFinding from '../PathFinding/index';
import stateMachineData from './Configs/ControllerStates';
import controlBarOptions from './Configs/ControlBarOptions';


class Controller extends StateMachine{

	// CONSTRUCTOR
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

	// UTILITIES
	makeTransitionFromEventHook(transition){
		return setTimeout(() => {
			this[transition]();
		}, 0);
	}

	// STATE-MACHINE EVENT-HOOKS
	onAfterInitialize(){
		this.viewRenderer.init();
		this.shiftStartPoint(this.grid.startPoint.x, this.grid.startPoint.y);
		this.shiftEndPoint(this.grid.endPoint.x, this.grid.endPoint.y);
		this.bindEventListeners();
		this.makeTransitionFromEventHook("edit");
	}

	onEnterEditing(){
		controlBarOptions.Editing.allowed.forEach(opt => {
			this.controlBar[opt].show();
		});
		controlBarOptions.Editing.notAllowed.forEach(opt => {
			this.controlBar[opt].hide();
		});
	}

	onEnterComputing(){
		controlBarOptions.Computing.allowed.forEach(opt => {
			this.controlBar[opt].show();
		});
		controlBarOptions.Computing.notAllowed.forEach(opt => {
			this.controlBar[opt].hide();
		});
	}

	onEnterPlaying(){
		controlBarOptions.Playing.allowed.forEach(opt => {
			this.controlBar[opt].show();
		});
		controlBarOptions.Playing.notAllowed.forEach(opt => {
			this.controlBar[opt].hide();
		});
	}

	onEnterPaused(){
		controlBarOptions.Paused.allowed.forEach(opt => {
			this.controlBar[opt].show();
		});
		controlBarOptions.Paused.notAllowed.forEach(opt => {
			this.controlBar[opt].hide();
		});
	}

	onEnterFinished(){
		controlBarOptions.Finished.allowed.forEach(opt => {
			this.controlBar[opt].show();
		});
		controlBarOptions.Finished.notAllowed.forEach(opt => {
			this.controlBar[opt].hide();
		});
	}
	
	onEnterPathCleared(){
		controlBarOptions.PathCleared.allowed.forEach(opt => {
			this.controlBar[opt].show();
		});
		controlBarOptions.PathCleared.notAllowed.forEach(opt => {
			this.controlBar[opt].hide();
		});
	}

	// CONTROLLER TO VIEW PROXIES
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

	// EVENT LISTENERS
	bindEventListeners(){
		this.bindGridEventListeners();
		this.bindControlCenterEventListeners();
		this.bindControlBarEventListeners();
	}

	bindGridEventListeners(){
		this.viewRenderer.tableElement.on('mousedown', (event) => {
			const {x, y} = $(event.target).data("coords");
			console.warn("non Editing==Finished State handling is left");
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
		let controlBar = $("#control-bar");
		this.controlBar = {
			start: controlBar.find('#start'), 
			pause: controlBar.find('#pause'), 
			stop: controlBar.find('#stop'), 
			restart: controlBar.find('#restart'), 
			clearPath: controlBar.find('#clearPath'), 
			clearWalls: controlBar.find('#clearWalls'), 
			undo: controlBar.find('#undo'), 
			step: controlBar.find('#step')
		};
		
		this.controlBar.start.on("click", () => {
			console.log("start");
			// Editing | Paused
			switch(this.state){
				case "Editing":
					this.compute();
					this.play();
					break;
				case "Paused":
					this.resume();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.pause.on("click", () => {
			console.log("pause");
			this.pause();
			// Playing
		});
		this.controlBar.stop.on("click", () => {
			console.log("stop");
			// Playing | Paused
			switch(this.state){
				case "Playing":
					this.pause();
					this.finish();
					break;
				case "Paused":
					this.finish();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.restart.on("click", () => {
			console.log("restart");
			// Playing | Paused | Finished
			switch(this.state){
				case "Playing":
					this.pause();
					this.restart();
					break;
				case "Paused":
					this.restart();
					break;
				case "Finished":
					this.restart();
					break;
				case "pathCleared":
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.clearPath.on("click", () => {
			console.log("clearPath");
			// Playing | Paused | Finished
			switch(this.state){
				case "Playing":
					this.pause();
					this.clearPath();
					break;
				case "Paused":
					this.clearPath();
					break;
				case "Finished":
					this.clearPath();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.clearWalls.on("click", () => {
			console.log("clearWalls");
			// Playing | Paused | Finished | pathCleared
			switch(this.state){
				case "Playing":
					this.pause();
					this.gridEdit();
					break;
				case "Paused":
					this.gridEdit();
					break;
				case "Finished":
					this.gridEdit();
					break;
				case "pathCleared":
					this.gridEdit();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.undo.on("click", () => {
			console.log("undo");
			// Playing | Paused | Finished
			switch(this.state){
				case "Playing":
					this.pause();
					break;
				case "Paused":
					break;
				case "Finished":
					this.pause();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.step.on("click", () => {
			console.log("step");
			// Playing | Paused
			switch(this.state){
				case "Playing":
					this.pause();
					break;
				case "Paused":
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
	}
}

export default Controller;
