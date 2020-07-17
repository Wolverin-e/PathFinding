const START = 'start',
	PAUSE = 'pause',
	STOP = 'stop',
	RESTART = 'restart',
	CLEARPATH = 'clearPath',
	CLEARWALLS = 'clearWalls',
	UNDO = 'undo',
	STEP = 'step';

const allOptions = [
	START,
	PAUSE,
	STOP,
	RESTART,
	CLEARPATH,
	CLEARWALLS,
	UNDO,
	STEP
];

const stateOptionMapping = {
	Editing: {
		allowed: [
			START,
			CLEARWALLS
		]
	},
	Computing: {
		allowed: []
	},
	Playing: {
		allowed: [
			PAUSE,
			STOP,
			RESTART,
			CLEARPATH,
			CLEARWALLS,
			UNDO,
			STEP
		]
	},
	Paused: {
		allowed: [
			START,
			STOP,
			RESTART,
			CLEARPATH,
			CLEARWALLS,
			UNDO,
			STEP
		]
	},
	PathCleared: {
		allowed: [
			RESTART,
			CLEARWALLS
		]
	},
	Finished: {
		allowed: [
			RESTART,
			CLEARPATH,
			CLEARWALLS,
			UNDO
		]
	}
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
	CLEARPATH,
	CLEARWALLS,
	UNDO,
	STEP,
};

export default stateOptionMapping;
