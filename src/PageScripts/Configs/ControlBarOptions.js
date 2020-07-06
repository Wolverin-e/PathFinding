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

const barOptions = {
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

Object.keys(barOptions).forEach(key => {
	barOptions[key].notAllowed = allOptions.filter(opt => {
		return !barOptions[key].allowed.includes(opt);
	});
});

export default barOptions;
