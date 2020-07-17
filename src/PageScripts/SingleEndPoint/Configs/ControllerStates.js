// var visualize = require('javascript-state-machine/lib/visualize');
// var StateMachine = require('javascript-state-machine');

export const states = {
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

export const transitions = {
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
	init: states.STEADY,
	transitions: [
		{
			name: transitions.INITIALIZE,
			from: states.STEADY,
			to: states.RENDERING
		},
		{
			name: transitions.EDIT,
			from: states.RENDERING,
			to: states.EDITING
		},
		{
			name: transitions.START_ADDING_WALLS,
			from: states.EDITING,
			to: states.ADDING_WALLS
		},
		{
			name: transitions.START_SHIFTING_END_POINT,
			from: states.EDITING,
			to: states.SHIFTING_END_POINT
		},
		{
			name: transitions.START_REMOVING_WALLS,
			from: states.EDITING,
			to: states.REMOVING_WALLS
		},
		{
			name: transitions.START_SHIFTING_START_POINT,
			from: states.EDITING,
			to: states.SHIFTING_START_POINT
		},
		{
			name: transitions.GO_BACK_TO_EDITING,
			from: [states.ADDING_WALLS, states.REMOVING_WALLS, states.SHIFTING_START_POINT, states.SHIFTING_END_POINT],
			to: states.EDITING
		},
		{
			name: transitions.COMPUTE,
			from: states.EDITING,
			to: states.COMPUTING
		},
		{
			name: transitions.PLAY,
			from: states.COMPUTING,
			to: states.PLAYING
		},
		{
			name: transitions.PAUSE,
			from: [states.PLAYING, states.FINISHED],
			to: states.PAUSED
		},
		{
			name: transitions.RESUME,
			from: states.PAUSED,
			to: states.PLAYING
		},
		{
			name: transitions.FINISH,
			from: [states.PAUSED],
			to: states.FINISHED
		},
		{
			name: transitions.RESTART,
			from: [states.FINISHED, states.PAUSED, states.PATH_CLEARED],
			to: states.PLAYING
		},
		{
			name: transitions.CLEAR_PATH,
			from: [states.PAUSED, states.FINISHED],
			to: states.PATH_CLEARED
		},
		{
			name: transitions.GRID_EDIT,
			from: [states.FINISHED, states.PAUSED, states.PATH_CLEARED],
			to: states.EDITING
		}
	]
};

// const sm = new StateMachine(stateMachineData);
// console.log(visualize(sm));



export default stateMachineData;
