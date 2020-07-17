// var visualize = require('javascript-state-machine/lib/visualize');
// var StateMachine = require('javascript-state-machine');

export const STATES = {
	STEADY: "steady",
	RENDERING: "Rendering",
	PLAYING: "Playing",
	PAUSED: "Paused",
	FINISHED: "Finished",
	PATH_CLEARED: "Pathcleared", // Can't do "PathCleared" due to StateMachine event handlers convention
	EDITING: "Editing",
	COMPUTING: "Computing",
	ADDING_WALLS: "AddingWalls",
	REMOVING_WALLS :"RemovingWalls",
	SHIFTING_START_POINT: "ShiftingStartPoint",
	SHIFTING_END_POINT: "ShiftingEndPoint"
};

export const TRANSITIONS = {
	INITIALIZE: "initialize",
	EDIT: "edit",
	START_ADDING_WALLS: "startAddingWalls",
	START_SHIFTING_END_POINT: "startShiftingEndPoint",
	START_REMOVING_WALLS: "startRemovingWalls",
	START_SHIFTING_START_POINT: "startShiftingStartPoint",
	GO_BACK_TO_EDITING: "goBackToEditing",
	COMPUTE: "compute",
	PLAY: "play",
	PAUSE: "pause",
	RESUME: "resume",
	FINISH: "finish",
	RESTART: "restart",
	CLEAR_PATH: "clearPath",
	GRID_EDIT: "gridEdit"
};

const stateMachineData = {
	init: STATES.STEADY,
	transitions: [
		{
			name: TRANSITIONS.INITIALIZE,
			from: STATES.STEADY,
			to: STATES.RENDERING
		},
		{
			name: TRANSITIONS.EDIT,
			from: STATES.RENDERING,
			to: STATES.EDITING
		},
		{
			name: TRANSITIONS.START_ADDING_WALLS,
			from: STATES.EDITING,
			to: STATES.ADDING_WALLS
		},
		{
			name: TRANSITIONS.START_SHIFTING_END_POINT,
			from: STATES.EDITING,
			to: STATES.SHIFTING_END_POINT
		},
		{
			name: TRANSITIONS.START_REMOVING_WALLS,
			from: STATES.EDITING,
			to: STATES.REMOVING_WALLS
		},
		{
			name: TRANSITIONS.START_SHIFTING_START_POINT,
			from: STATES.EDITING,
			to: STATES.SHIFTING_START_POINT
		},
		{
			name: TRANSITIONS.GO_BACK_TO_EDITING,
			from: [STATES.ADDING_WALLS, STATES.REMOVING_WALLS, STATES.SHIFTING_START_POINT, STATES.SHIFTING_END_POINT],
			to: STATES.EDITING
		},
		{
			name: TRANSITIONS.COMPUTE,
			from: STATES.EDITING,
			to: STATES.COMPUTING
		},
		{
			name: TRANSITIONS.PLAY,
			from: STATES.COMPUTING,
			to: STATES.PLAYING
		},
		{
			name: TRANSITIONS.PAUSE,
			from: [STATES.PLAYING, STATES.FINISHED],
			to: STATES.PAUSED
		},
		{
			name: TRANSITIONS.RESUME,
			from: STATES.PAUSED,
			to: STATES.PLAYING
		},
		{
			name: TRANSITIONS.FINISH,
			from: [STATES.PAUSED],
			to: STATES.FINISHED
		},
		{
			name: TRANSITIONS.RESTART,
			from: [STATES.FINISHED, STATES.PAUSED, STATES.PATH_CLEARED],
			to: STATES.PLAYING
		},
		{
			name: TRANSITIONS.CLEAR_PATH,
			from: [STATES.PAUSED, STATES.FINISHED],
			to: STATES.PATH_CLEARED
		},
		{
			name: TRANSITIONS.GRID_EDIT,
			from: [STATES.FINISHED, STATES.PAUSED, STATES.PATH_CLEARED],
			to: STATES.EDITING
		}
	]
};

// const sm = new StateMachine(stateMachineData);
// console.log(visualize(sm));

export default stateMachineData;
