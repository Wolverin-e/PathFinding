import MultiController from './MultiController';
import ViewRenderer from './MultiViewRenderer';

const rows = 50,
	columns = 50,
	undoRedoBurstSteps = 1000,
	stepDelay = 1,
	clientHeight = document.documentElement.clientHeight,
	clientWidth = document.documentElement.clientWidth,
	nodeSize = clientWidth/columns,
	midRowIndex = Math.floor((clientHeight/nodeSize)/2),
	colDivison = Math.floor(columns/11-1),
	offset=15,
	startPoint = {
		x: colDivison+offset,
		y: midRowIndex
	},
	endPoints = [{
		x: colDivison*2+offset,
		y: midRowIndex
	}, {
		x: colDivison*3+offset,
		y: midRowIndex
	}, {
		x: colDivison*4+offset,
		y: midRowIndex
	}, {
		x: colDivison*5+offset,
		y: midRowIndex
	}];

function init(){

	let viewRenderer = new ViewRenderer({
		rows,
		columns
	});

	let controller = new MultiController({
		rows,
		columns,
		viewRenderer,
		startPoint,
		endPoints,
		undoRedoBurstSteps,
		stepDelay
	});
	controller.initialize();
}

export default init;
