import $ from 'jquery';
import PathFinding from '../../PathFinding/index';

import Controller from '../SingleEndPoint/Controller';

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
		this.attachOpsEventListeners();
		this.attachControllerLifeCycleEventHooks();
		this.makeTransitionFromEventHook("edit");
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
					this.endPointBeingShifted = {x, y};
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
					this.shiftEndPointTo(x, y);
					break;
				default:
					break;
			}
		});

		this.viewRenderer.tableElement.on('mouseup', () => {
			if(this.can('goBackToEditing')){
				this.endPointBeingShifted = undefined;
				this.goBackToEditing();
			}
		});
	}
}

export default MultiController;
