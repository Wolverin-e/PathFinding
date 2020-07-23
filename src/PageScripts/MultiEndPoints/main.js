import MultiController from './MultiController';
import ViewRenderer from './MultiViewRenderer';

const rows = 50,
	columns = 50,
	undoRedoBurstSteps = 200,
	stepDelay = 1,
	clientHeight = document.documentElement.clientHeight,
	clientWidth = document.documentElement.clientWidth,
	nodeSize = clientWidth/columns,
	midRowIndex = Math.floor((clientHeight/nodeSize)/2),
	colDivison = Math.floor(columns/11-1),
	xOffset=15,
	yOffset=2,
	startPoint = {
		x: colDivison+xOffset,
		y: midRowIndex
	},
	endPoints = [{
		x: colDivison*2+xOffset,
		y: midRowIndex-yOffset
	}, {
		x: colDivison*3+xOffset,
		y: midRowIndex+yOffset
	}, {
		x: colDivison*4+xOffset,
		y: midRowIndex-yOffset
	}, {
		x: colDivison*5+xOffset,
		y: midRowIndex+yOffset
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
