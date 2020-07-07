import $ from 'jquery';
import StateMachine from 'javascript-state-machine';
import Denque from 'denque';

import PathFinding from '../PathFinding/index';
import stateMachineData from './Configs/ControllerStates';
import controlBarOptions from './Configs/ControlBarOptions';

Denque.prototype.pushArray = function(arr) {
	arr.forEach(elem => this.push(elem));
};

var opQueue = new Denque();
var undoQueue = new Denque();
var wallList = [];

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

	addPathToOps(path){
		opQueue.pushArray(path.map(coordinate => {
			return{
				x: coordinate.x, 
				y: coordinate.y, 
				att: "path", 
				val: true
			};
		}));
	}

	// STATE-MACHINE EVENT-HOOKS
	onAfterInitialize(){
		this.viewRenderer.init();
		this.shiftStartPoint(this.grid.startPoint.x, this.grid.startPoint.y);
		this.shiftEndPoint(this.grid.endPoint.x, this.grid.endPoint.y);
		this.bindEventListeners();
		this.attachOpsEventListeners();
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
		wallList.push({x, y});
		this.grid.makeXYWall(x, y);
		this.viewRenderer.makeWall(x, y);
	}

	removeWall(x, y){
		if(this.grid.isXYStartPoint(x, y)) return;
		if(this.grid.isXYEndPoint(x, y)) return;
		this.grid.destroyWallAtXY(x, y);
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

	findPath(){
		// FIND PATH AND FILL THE OPQUEUE
		let algorithm = new PathFinding[this.algorithm](this.algorithmOptions);
		let path = algorithm.findPath(this.grid.clone());
		this.addPathToOps(path);
	}
	startDelayedStepLoop(){
		// START PLAY LOOP
		let loop = async () => {
			if(this.state !== "Playing") return;
			await this.delayedStep();
			loop();
		};
		loop();
	}
	delayedStep(){
		const tm = 10;
		// ONE STEP FORWARD FROM THE <opQueue>
		return new Promise((resolve) => {
			setTimeout(() => {
				this.instantStep();
				resolve();
			}, tm);
		});
	}
	instantStep(){
		if(opQueue.isEmpty()) {
			if(this.can("pause")) this.pause();
			if(this.can("finish")) this.finish();
			return;
		}
		let coords = opQueue.shift();
		undoQueue.push(coords);
		this.viewRenderer.addOpClassAtXY(coords.x, coords.y, coords.att);
	}
	undo(){
		// ONE STEP UNDO FROM THE <undoQueue>
		if(undoQueue.isEmpty()) return;
		let coords = undoQueue.pop();
		this.viewRenderer.popOpClassAtXY(coords.x, coords.y);
		opQueue.unshift(coords);
	}
	startUndoLoop(){
		while(!undoQueue.isEmpty()){
			this.undo();
		}
	}
	onClearPath(){
		// CLEAR PATH FROM THE <undoQueue>
		this.startUndoLoop();
	}
	clearWalls(){
		// CLEAR WALLS FROM THE <wallList>
		while(wallList.length){
			let coords = wallList.pop();
			this.removeWall(coords.x, coords.y);
		}
	}
	clearReasources(){
		// CLEAR <opQueue> <undoQueue> <wallList>
		opQueue.clear();
		undoQueue.clear();
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
			if(this.is('Paused')){
				this.finish(); // STATEMACHINE TRANSITION
				this.clearPath(); // STATEMACHINE TRANSITION
				this.clearReasources();
				this.gridEdit(); // STATEMACHINE TRANSITION
			}
			if(this.is('Finished')){
				this.clearPath(); // STATEMACHINE TRANSITION
				this.clearReasources();
				this.gridEdit(); // STATEMACHINE TRANSITION
			}
			if(this.is('pathCleared')){
				this.clearReasources();
				this.gridEdit(); // STATEMACHINE TRANSITION
			}

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
					this.compute(); // STATEMACHINE TRANSITION
					this.findPath();
					this.play(); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case "Paused":
					this.resume(); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.pause.on("click", () => {
			console.log("pause");
			this.pause(); // STATEMACHINE TRANSITION
			// Playing
		});
		this.controlBar.stop.on("click", () => {
			console.log("stop");
			// Playing | Paused
			switch(this.state){
				case "Playing":
					this.pause(); // STATEMACHINE TRANSITION
					this.clearPath(); // STATEMACHINE TRANSITION
					break;
				case "Paused":
					this.clearPath(); // STATEMACHINE TRANSITION
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
					this.pause(); // STATEMACHINE TRANSITION
					this.clearPath(); // STATEMACHINE TRANSITION
					this.restart(); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case "Paused":
					this.clearPath(); // STATEMACHINE TRANSITION
					this.restart(); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case "Finished":
					this.clearPath(); // STATEMACHINE TRANSITION
					this.restart(); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case "pathCleared":
					this.restart(); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
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
					this.pause(); // STATEMACHINE TRANSITION
					this.clearPath(); // STATEMACHINE TRANSITION
					break;
				case "Paused":
					this.clearPath(); // STATEMACHINE TRANSITION
					break;
				case "Finished":
					this.clearPath(); // STATEMACHINE TRANSITION
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
				case "Editing":
					this.clearWalls();
					break;
				case "Playing":
					this.pause(); // STATEMACHINE TRANSITION
					this.clearWalls();
					this.clearPath(); // STATEMACHINE TRANSITION
					this.clearReasources();
					this.gridEdit(); // STATEMACHINE TRANSITION
					break;
				case "Paused":
					this.clearWalls();
					this.clearPath(); // STATEMACHINE TRANSITION
					this.clearReasources();
					this.gridEdit(); // STATEMACHINE TRANSITION
					break;
				case "Finished":
					this.clearWalls();
					this.clearPath(); // STATEMACHINE TRANSITION
					this.clearReasources();
					this.gridEdit(); // STATEMACHINE TRANSITION
					break;
				case "pathCleared":
					this.clearWalls();
					this.clearReasources();
					this.gridEdit();  // STATEMACHINE TRANSITION
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
					this.pause(); // STATEMACHINE TRANSITION
					this.undo();
					break;
				case "Paused":
					this.undo();
					break;
				case "Finished":
					this.undo();
					this.pause(); // STATEMACHINE TRANSITION
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
					this.pause(); // STATEMACHINE-TRANSITION
					this.instantStep();
					break;
				case "Paused":
					this.instantStep();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
	}

	attachOpsEventListeners(){
		PathFinding.GraphNode.prototype = {
			set visited(val){
				this._visited = val;
				opQueue.push({
					x: this.x, 
					y: this.y, 
					att: 'visited', 
					val
				});
			}
		};
	}
}

export default Controller;
