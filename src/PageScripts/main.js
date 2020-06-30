import Controller from './Controller';
import ViewRenderer from './ViewRenderer';

let rows=50, 
	columns=50, 
	tableSelector="#grid";

export function init(){
	let viewRenderer = new ViewRenderer({
		rows,
		columns, 
		tableSelector
	});

	let controller = new Controller({
		rows, 
		columns, 
		viewRenderer
	});
	controller.init();
}
