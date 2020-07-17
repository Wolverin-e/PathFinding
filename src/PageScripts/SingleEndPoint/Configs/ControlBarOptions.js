import { STATES } from './ControllerStates';

const START = 'start',
	PAUSE = 'pause',
	STOP = 'stop',
	RESTART = 'restart',
	CLEAR_PATH = 'clearPath',
	CLEAR_WALLS = 'clearWalls',
	UNDO = 'undo',
	STEP = 'step';

const allOptions = [
	START,
	PAUSE,
	STOP,
	RESTART,
	CLEAR_PATH,
	CLEAR_WALLS,
	UNDO,
	STEP
];

const stateOptionMapping = {};

stateOptionMapping[STATES.EDITING] = {
	allowed: [
		START,
		CLEAR_WALLS
	]
};

stateOptionMapping[STATES.COMPUTING] = {
	allowed: []
};

stateOptionMapping[STATES.PLAYING] = {
	allowed: [
		PAUSE,
		STOP,
		RESTART,
		CLEAR_PATH,
		CLEAR_WALLS,
		UNDO,
		STEP
	]
};

stateOptionMapping[STATES.PAUSED] = {
	allowed: [
		START,
		STOP,
		RESTART,
		CLEAR_PATH,
		CLEAR_WALLS,
		UNDO,
		STEP
	]
};

stateOptionMapping[STATES.PATH_CLEARED] = {
	allowed: [
		RESTART,
		CLEAR_WALLS
	]
};

stateOptionMapping[STATES.FINISHED] = {
	allowed: [
		RESTART,
		CLEAR_PATH,
		CLEAR_WALLS,
		UNDO
	]
};


Object.keys(stateOptionMapping).forEach(key => {
	stateOptionMapping[key].notAllowed = allOptions.filter(opt => {
		return !stateOptionMapping[key].allowed.includes(opt);
	});
});

export const BAR_OPTIONS = {
	START,
	PAUSE,
	STOP,
	RESTART,
	CLEAR_PATH,
	CLEAR_WALLS,
	UNDO,
	STEP
};

export default stateOptionMapping;
