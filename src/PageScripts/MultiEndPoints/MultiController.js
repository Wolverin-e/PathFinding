import $ from 'jquery';
import PathFinding from '../../PathFinding/index';

import Controller from '../SingleEndPoint/Controller';
import { STATES, TRANSITIONS } from '../SingleEndPoint/Configs/ControllerStates';

class MultiController extends Controller{

	// CONSTRUCTOR
	constructor(options){
		super(options);
		this.grid = new PathFinding.MultiEPGrid({
			rows: this.rows,
			columns: this.columns,
			startPoint: options.startPoint,
			endPoints: options.endPoints
		});
	}

	// STATE-MACHINE EVENT-HOOKS
	onAfterInitialize(){
		this.viewRenderer.init();
		this.shiftStartPoint(this.grid.startPoint.x, this.grid.startPoint.y);
		this.grid.endPoints.forEach(ep => {
			this.viewRenderer.addEndPoint(ep.x, ep.y);
		});
		this.bindDOMEventListeners();
		this.attachPathFindingOpsSnoopLayer();
		this.attachControllerLifeCycleEventHooks();
		this.makeTransitionFromEventHook(TRANSITIONS.EDIT);
	}

	// CONTROLLER TO VIEW PROXIES
	shiftEndPointTo(x, y){
		if(this.grid.isXYWallElement(x, y)) return;
		if(this.grid.isXYStartPoint(x, y)) return;
		if(this.grid.isXYEndPoint(x, y, this.endPointBeingShifted)) return;
		this.grid.shiftEndPoint(this.endPointBeingShifted, {x, y});
		this.viewRenderer.shiftEndPoint(this.endPointBeingShifted, {x, y});
		this.endPointBeingShifted = {x, y};
	}


	// EVENT LISTENERS
	bindGridEventListeners(){
		this.viewRenderer.tableElement.on('mousedown', (event) => {
			const {x, y} = $(event.target).data("coords");
			if(this.is(STATES.PAUSED)){
				this[TRANSITIONS.FINISH](); // STATEMACHINE TRANSITION
				this[TRANSITIONS.CLEAR_PATH](); // STATEMACHINE TRANSITION
				this.clearReasources();
				this[TRANSITIONS.GRID_EDIT](); // STATEMACHINE TRANSITION
			}
			if(this.is(STATES.FINISHED)){
				this[TRANSITIONS.CLEAR_PATH](); // STATEMACHINE TRANSITION
				this.clearReasources();
				this[TRANSITIONS.GRID_EDIT](); // STATEMACHINE TRANSITION
			}
			if(this.is(STATES.PATH_CLEARED)){
				this.clearReasources();
				this[TRANSITIONS.GRID_EDIT](); // STATEMACHINE TRANSITION
			}

			if(this.is(STATES.EDITING)){
				if(this.grid.isXYStartPoint(x, y)){
					this[TRANSITIONS.START_SHIFTING_START_POINT]();
					return;
				}

				if(this.grid.isXYEndPoint(x, y)){
					this.endPointBeingShifted = {x, y};
					this[TRANSITIONS.START_SHIFTING_END_POINT]();
					return;
				}

				if(this.grid.isXYWallElement(x, y)){
					this[TRANSITIONS.START_REMOVING_WALLS]();
					this.removeWall(x, y);
				} else {
					this[TRANSITIONS.START_ADDING_WALLS]();
					this.makeWall(x, y);
				}
			}
		});

		this.viewRenderer.tableElement.on('mouseover', (event) => {
			if(!$(event.target).is('td')) return;
			let {x, y} = $(event.target).data("coords");

			switch(this.state){
				case STATES.ADDING_WALLS:
					this.makeWall(x, y);
					break;
				case STATES.REMOVING_WALLS:
					this.removeWall(x, y);
					break;
				case STATES.SHIFTING_START_POINT:
					this.shiftStartPoint(x, y);
					break;
				case STATES.SHIFTING_END_POINT:
					this.shiftEndPointTo(x, y);
					break;
				default:
					break;
			}
		});

		this.viewRenderer.tableElement.on('mouseup', () => {
			if(this.can(TRANSITIONS.GO_BACK_TO_EDITING)){
				this.endPointBeingShifted = undefined;
				this[TRANSITIONS.GO_BACK_TO_EDITING]();
			}
		});
	}
}

export default MultiController;
