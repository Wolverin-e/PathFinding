import $ from 'jquery';
import StateMachine from 'javascript-state-machine';
import Denque from 'denque';

import PathFinding from '../../PathFinding/index';
import stateMachineData, { states, transitions } from './Configs/ControllerStates';
import stateOptionMapping, { barOptions } from './Configs/ControlBarOptions';
import keys from './Configs/KeyBoardMapping';

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
		if(this.is(states.PLAYING)) this[transitions.PAUSE]();
		if(this.is(states.PAUSED)){
			this[transitions.FINISH](); // STATEMACHINE TRANSITION
			this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
			this.clearReasources();
			this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
		}
		if(this.is(states.FINISHED)){
			this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
			this.clearReasources();
			this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
		}
		if(this.is(states.PATH_CLEARED)){
			this.clearReasources();
			this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
		}
	}

	// STATE-MACHINE EVENT-HOOKS
	onAfterInitialize(){
		this.viewRenderer.init();
		this.shiftStartPoint(this.grid.startPoint.x, this.grid.startPoint.y);
		this.shiftEndPoint(this.grid.endPoint.x, this.grid.endPoint.y);
		this.bindDOMEventListeners();
		this.attachPathFindingOpsSnoopLayer();
		this.attachControllerLifeCycleEventHooks();
		this.makeTransitionFromEventHook(transitions.EDIT);
	}

	attachControllerLifeCycleEventHooks(){
		let mainStates = [
			states.EDITING,
			states.COMPUTING,
			states.PLAYING,
			states.PAUSED,
			states.FINISHED,
			states.PATH_CLEARED
		];

		mainStates.forEach(state => {
			this["onEnter"+state] = function(){
				stateOptionMapping[state].allowed.forEach(opt => {
					this.controlBar[opt].show();
				});
				stateOptionMapping[state].notAllowed.forEach(opt => {
					this.controlBar[opt].hide();
				});
			};
		});
	}

	attachPathFindingOpsSnoopLayer(){
		PathFinding.GraphNode.prototype = {
			set visited(val){
				this._visited = val;
				opQueue.push({
					x: this.x,
					y: this.y,
					att: val?'visited':'unVisited',
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
			},
			set processed(val){
				this._processed = val;
				opQueue.push({
					x: this.x,
					y: this.y,
					att: 'processed',
					val
				});
			},
			get processed(){
				return this._processed;
			},
			set explored(val){
				this._explored = val;
				opQueue.push({
					x: this.x,
					y: this.y,
					att: 'explored',
					val
				});
			},
			get explored(){
				return this._explored;
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
			if(this.can(transitions.PAUSE)) this[transitions.PAUSE]();
			if(this.can(transitions.FINISH)) this[transitions.FINISH]();
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
			if(this.state !== states.PLAYING) return;
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
		this.bindKeyBoardEventListeners();
	}

	bindGridEventListeners(){
		this.viewRenderer.tableElement.on('mousedown', (event) => {
			const {x, y} = $(event.target).data("coords");
			if(this.is(states.PAUSED)){
				this[transitions.FINISH](); // STATEMACHINE TRANSITION
				this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
				this.clearReasources();
				this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
			}
			if(this.is(states.FINISHED)){
				this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
				this.clearReasources();
				this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
			}
			if(this.is(states.PATH_CLEARED)){
				this.clearReasources();
				this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
			}

			if(this.is(states.EDITING)){
				if(this.grid.isXYStartPoint(x, y)){
					this[transitions.START_SHIFTING_START_POINT]();
					return;
				}

				if(this.grid.isXYEndPoint(x, y)){
					this[transitions.START_SHIFTING_END_POINT]();
					return;
				}

				if(this.grid.isXYWallElement(x, y)){
					this[transitions.START_REMOVING_WALLS]();
					this.removeWall(x, y);
				} else {
					this[transitions.START_ADDING_WALLS]();
					this.makeWall(x, y);
				}
			}
		});

		this.viewRenderer.tableElement.on('mouseover', (event) => {
			if(!$(event.target).is('td')) return;
			let {x, y} = $(event.target).data("coords");

			switch(this.state){
				case states.ADDING_WALLS:
					this.makeWall(x, y);
					break;
				case states.REMOVING_WALLS:
					this.removeWall(x, y);
					break;
				case states.SHIFTING_START_POINT:
					this.shiftStartPoint(x, y);
					break;
				case states.SHIFTING_END_POINT:
					this.shiftEndPoint(x, y);
					break;
				default:
					break;
			}
		});

		this.viewRenderer.tableElement.on('mouseup', () => {
			if(this.can(transitions.GO_BACK_TO_EDITING)){
				this[transitions.GO_BACK_TO_EDITING]();
			}
		});
	}

	bindControlCenterEventListeners(){
		let controlCenter = $('#control-center');

		this.controlCenter = {
			stepsInpField: controlCenter.find("#steps"),
			delayInpField: controlCenter.find("#delay"),
			algorithmSelector: controlCenter.find("#algorithmSelector")
		};

		this.controlCenter.stepsInpField.val(this.undoRedoBurstSteps);
		this.controlCenter.stepsInpField.on("input", (event) => {
			this.undoRedoBurstSteps = event.target.value?event.target.value:this.defaultUndoRedoBurstSteps;
		});

		this.controlCenter.delayInpField.val(this.stepDelay);
		this.controlCenter.delayInpField.on("input", (event) => {
			this.stepDelay = event.target.value?event.target.value:this.defaultStepDelay;
		});

		this.algorithm = this.controlCenter.algorithmSelector.val();
		this.algorithmOptions = {};

		let radioOpt = controlCenter.find(`#${this.algorithm} .options-radio-section input[type='radio']:checked`);
		if(radioOpt.length) this.algorithmOptions['heuristic'] = radioOpt.val();

		let checkBoxOpts = controlCenter.find(`#${this.algorithm} .options-checkbox-section input[type='checkbox']:checked`);
		checkBoxOpts.each((i, elem) => {
			this.algorithmOptions[elem.value] = true;
		});

		this.controlCenter.algorithmSelector.on('change', (event) => {
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
				case states.EDITING:
					this[transitions.COMPUTE](); // STATEMACHINE TRANSITION
					this.findPath();
					this[transitions.PLAY](); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case states.PAUSED:
					this[transitions.RESUME](); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
		this.controlBar.pause.on("click", () => {
			console.log("pause");
			this[transitions.PAUSE](); // STATEMACHINE TRANSITION
			// Playing
		});
		this.controlBar.stop.on("click", () => {
			console.log("stop");
			// Playing | Paused
			switch(this.state){
				case states.PLAYING:
					this[transitions.PAUSE](); // STATEMACHINE TRANSITION
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					break;
				case states.PAUSED:
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
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
				case states.PLAYING:
					this[transitions.PAUSE](); // STATEMACHINE TRANSITION
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					this[transitions.RESTART](); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case states.PAUSED:
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					this[transitions.RESTART](); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case states.FINISHED:
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					this[transitions.RESTART](); // STATEMACHINE TRANSITION
					this.startDelayedStepLoop();
					break;
				case states.PATH_CLEARED:
					this[transitions.RESTART](); // STATEMACHINE TRANSITION
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
				case states.PLAYING:
					this[transitions.PAUSE](); // STATEMACHINE TRANSITION
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					break;
				case states.PAUSED:
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					break;
				case states.FINISHED:
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
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
				case states.EDITING:
					this.clearWalls();
					break;
				case states.PLAYING:
					this[transitions.PAUSE](); // STATEMACHINE TRANSITION
					this.clearWalls();
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					this.clearReasources();
					this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
					break;
				case states.PAUSED:
					this.clearWalls();
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					this.clearReasources();
					this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
					break;
				case states.FINISHED:
					this.clearWalls();
					this[transitions.CLEAR_PATH](); // STATEMACHINE TRANSITION
					this.clearReasources();
					this[transitions.GRID_EDIT](); // STATEMACHINE TRANSITION
					break;
				case states.PATH_CLEARED:
					this.clearWalls();
					this.clearReasources();
					this[transitions.GRID_EDIT]();  // STATEMACHINE TRANSITION
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
				case states.PLAYING:
					this[transitions.PAUSE](); // STATEMACHINE TRANSITION
					this.burstUndo(this.undoRedoBurstSteps);
					break;
				case states.PAUSED:
					this.burstUndo(this.undoRedoBurstSteps);
					break;
				case states.FINISHED:
					this.burstUndo(this.undoRedoBurstSteps);
					this[transitions.PAUSE](); // STATEMACHINE TRANSITION
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
				case states.PLAYING:
					this[transitions.PAUSE](); // STATEMACHINE-TRANSITION
					this.burstInstantSteps(this.undoRedoBurstSteps);
					break;
				case states.PAUSED:
					this.burstInstantSteps(this.undoRedoBurstSteps);
					break;
				default:
					console.warn("Undefined State Behaviour");
					break;
			}
		});
	}

	bindKeyBoardEventListeners(){
		const isVisible = btn => this.controlBar[btn].is(":visible");
		const click = btn => this.controlBar[btn].click();
		const increase = (field, byValueOf, thisAttrToChange) => {
			let min = Number.parseInt(this.controlCenter[field].attr("min"));
			let max = Number.parseInt(this.controlCenter[field].attr("max"));
			let val = Number.parseInt(this.controlCenter[field].val());
			val = val+byValueOf;
			val = val<min?min:(val>max?max:val);
			this.controlCenter[field].val(val); // not triggering Change Event
			this[thisAttrToChange] = val;
		};

		$(document).keydown(event => {

			switch(event.keyCode){
				case keys.SPACE:
					if(isVisible(barOptions.START)){
						click(barOptions.START);
					} else if(isVisible(barOptions.PAUSE)){
						click(barOptions.PAUSE);
					} else if(isVisible(barOptions.RESTART)){
						click(barOptions.RESTART);
					}
					break;

				case keys.BACKSPACE:
					if(isVisible(barOptions.CLEAR_PATH)){
						click(barOptions.CLEAR_PATH);
					} else if(isVisible(barOptions.CLEAR_WALLS)){
						click(barOptions.CLEAR_WALLS);
					}
					break;

				case keys.ARROW_LEFT:
					if(isVisible(barOptions.UNDO)){
						click(barOptions.UNDO);
					}
					break;

				case keys.ARROW_RIGHT:
					if(isVisible(barOptions.STEP)){
						click(barOptions.STEP);
					}
					break;

				case keys.ARROW_UP:
					if(event.altKey){
						increase("delayInpField", 5, "stepDelay");
					} else {
						increase("stepsInpField", 5, "undoRedoBurstSteps");
					}
					break;

				case keys.ARROW_DOWN:
					if(event.altKey){
						increase("delayInpField", -5, "stepDelay");
					} else {
						increase("stepsInpField", -5, "undoRedoBurstSteps");
					}
					break;

				default:
					break;
			}
		});
	}
}

export default Controller;
