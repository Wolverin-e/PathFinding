import Controller from './Controller';
import ViewRenderer from './ViewRenderer';

const rows = 50,
	columns = 50,
	undoRedoBurstSteps = 5,
	stepDelay = 10,
	clientHeight = document.documentElement.clientHeight,
	clientWidth = document.documentElement.clientWidth,
	nodeSize = clientWidth/columns,
	midRowIndex = Math.floor((clientHeight/nodeSize)/2),
	midColIndex = Math.floor(columns/2-1),
	startPoint = {
		x: midColIndex-4,
		y: midRowIndex
	},
	endPoint = {
		x: midColIndex+4+1,
		y: midRowIndex
	};

function init(){
	let viewRenderer = new ViewRenderer({
		rows,
		columns
	});

	let controller = new Controller({
		rows,
		columns,
		viewRenderer,
		startPoint,
		endPoint,
		undoRedoBurstSteps,
		stepDelay
	});
	controller.initialize();
}

export default init;
