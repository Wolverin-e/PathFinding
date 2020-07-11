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
		this.defaultStepDelay = options.stepDelay;
		this.U = options.undoRedoBurstSteps;
		
		this.stepDelay = options.stepDelay;
		this.undoRedoBurstSteps = options.undoRedoBurstSteps;
		
		this.grid = new PathFinding.Grid({
			rows: this.rows, 
			columns: this.columns, 
			startPoint: options.startPoint, 
			endPoint: options.endPoint
		});
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

	accomodateControlCenterAlgorithmEntityChange(){
		if(this.is("Playing")) this.pause();
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
	}

	// STATE-MACHINE EVENT-HOOKS
	onAfterInitialize(){
		this.viewRenderer.init();
		this.shiftStartPoint(this.grid.startPoint.x, this.grid.startPoint.y);
		this.shiftEndPoint(this.grid.endPoint.x, this.grid.endPoint.y);
		this.bindDOMEventListeners();
		this.attachOpsEventListeners();
		this.attachControllerLifeCycleEventHooks();
		this.makeTransitionFromEventHook("edit");
	}

	attachControllerLifeCycleEventHooks(){
		let states = [
			"Editing", 
			"Computing", 
			"Playing", 
			"Paused", 
			"Finished", 
			"PathCleared"
		];

		states.forEach(state => {
			this["onEnter"+state] = function(){
				controlBarOptions[state].allowed.forEach(opt => {
					this.controlBar[opt].show();
				});
				controlBarOptions[state].notAllowed.forEach(opt => {
					this.controlBar[opt].hide();
				});
			};
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
			}, 
			get visited(){
				return this._visited;
			}, 
			set addedToQueue(val){
				this._addedToQueue = val;
				opQueue.push({
					x: this.x, 
					y: this.y, 
					att: 'addedToQueue', 
					val
				});
			}, 
			get addedToQueue(){
				return this._addedToQueue;
			}, 
			set addedToHeap(val){
				this._addedToHeap = val;
				opQueue.push({
					x: this.x, 
					y: this.y, 
					att: 'addedToHeap', 
					val
				});
			}, 
			get addedToHeap(){
				return this._addedToHeap;
			}, 
			set currentNode(val){
				this._currentNode = val;
				opQueue.push({
					x: this.x, 
					y: this.y, 
					att: 'currentNode', 
					val
				});
			}, 
			get currentNode(){
				return this._currentNode;
			}
		};
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
	delayedStep(){
		// ONE STEP FORWARD FROM THE <opQueue>
		return new Promise((resolve) => {
			setTimeout(() => {
				this.instantStep();
				resolve();
			}, this.stepDelay);
		});
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
	burstInstantSteps(steps){
		while(steps--){
			this.instantStep();
		}
	}
	instantUndo(){
		// ONE STEP UNDO FROM THE <undoQueue>
		if(undoQueue.isEmpty()) return;
		let coords = undoQueue.pop();
		this.viewRenderer.popOpClassAtXY(coords.x, coords.y);
		opQueue.unshift(coords);
	}
	startInstantUndoLoop(){
		while(!undoQueue.isEmpty()){
			this.instantUndo();
		}
	}
	burstUndo(steps){
		while(steps--){
			this.instantUndo();
		}
	}
	onClearPath(){
		// CLEAR PATH FROM THE <undoQueue>
		this.startInstantUndoLoop();
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
	bindDOMEventListeners(){
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

		let stepsInpField = controlCenter.find("#steps"), 
			delayInpField = controlCenter.find("#delay"), 
			algorithmSelector = controlCenter.find("#algorithmSelector");
		
		stepsInpField.val(this.undoRedoBurstSteps);
		stepsInpField.on("input", (event) => {
			this.undoRedoBurstSteps = event.target.value?event.target.value:this.defaultUndoRedoBurstSteps;
		});
		
		delayInpField.val(this.stepDelay);
		delayInpField.on("input", (event) => {
			this.stepDelay = event.target.value?event.target.value:this.defaultStepDelay;
		});

		this.algorithm = algorithmSelector.val();
		this.algorithmOptions = {};
		
		let radioOpt = controlCenter.find(`#${this.algorithm} .options-radio-section input[type='radio']:checked`);
		if(radioOpt.length) this.algorithmOptions['heuristic'] = radioOpt.val();
		
		let checkBoxOpts = controlCenter.find(`#${this.algorithm} .options-checkbox-section input[type='checkbox']:checked`);
		checkBoxOpts.each((i, elem) => {
			this.algorithmOptions[elem.value] = true;
		});

		algorithmSelector.on('change', (event) => {
			this.accomodateControlCenterAlgorithmEntityChange();
			this.algorithm = event.target.value;
			this.algorithmOptions = {};

			let radioOpt = controlCenter.find(`#${this.algorithm} .options-radio-section input[type='radio']:checked`);
			if(radioOpt.length) this.algorithmOptions['heuristic'] = radioOpt.val();
			
			let checkBoxOpts = controlCenter.find(`#${this.algorithm} .options-checkbox-section input[type='checkbox']:checked`);
			checkBoxOpts.each((i, elem) => {
				this.algorithmOptions[elem.value] = true;
			});
		});

		controlCenter.find(`.options-radio-section input[type='radio']`).each((i, elem) => {
			$(elem).on("click", (event) => {
				this.accomodateControlCenterAlgorithmEntityChange();
				this.algorithmOptions.heuristic = event.target.value;
			});
		});
		
		controlCenter.find(`.options-checkbox-section input[type='checkbox']`).each((i, elem) => {
			$(elem).on("click", (event) => {
				this.accomodateControlCenterAlgorithmEntityChange();
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
					this.burstUndo(this.undoRedoBurstSteps);
					break;
				case "Paused":
					this.burstUndo(this.undoRedoBurstSteps);
					break;
				case "Finished":
					this.burstUndo(this.undoRedoBurstSteps);
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
					this.burstInstantSteps(this.undoRedoBurstSteps);
					break;
				case "Paused":
					this.burstInstantSteps(this.undoRedoBurstSteps);
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
	}
}

export default Controller;
