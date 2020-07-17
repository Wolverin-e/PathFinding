import { states } from './ControllerStates';

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

stateOptionMapping[states.EDITING] = {
	allowed: [
		START,
		CLEAR_WALLS
	]
};

stateOptionMapping[states.COMPUTING] = {
	allowed: []
};

stateOptionMapping[states.PLAYING] = {
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

stateOptionMapping[states.PAUSED] = {
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

stateOptionMapping[states.PATH_CLEARED] = {
	allowed: [
		RESTART,
		CLEAR_WALLS
	]
};

stateOptionMapping[states.FINISHED] = {
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

export const barOptions = {
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
