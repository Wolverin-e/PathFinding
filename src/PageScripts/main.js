import Controller from './Controller';
import ViewRenderer from './ViewRenderer';

let rows=50, 
	columns=50, 
	tableSelector="#grid", 
	startPoint={
		x: 20-1, 
		y: 11
	}, 
	endPoint={
		x: 30-1, 
		y: 11
	};

export function init(){
	let viewRenderer = new ViewRenderer({
		rows,
		columns, 
		tableSelector
	});

	let controller = new Controller({
		rows, 
		columns, 
		viewRenderer, 
		startPoint, 
		endPoint
	});
	controller.initialize();
}
