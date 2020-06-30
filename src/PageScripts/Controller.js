import PathFinding from '../PathFinding/index';
import $ from 'jquery';

class Controller{
	constructor(options){
		this.viewRenderer = options.viewRenderer;
		this.rows = options.rows;
		this.columns = options.columns;

		this.grid = new PathFinding.Grid({
			rows: this.rows, 
			columns: this.columns
		});
	}

	init(){
		this.bindEventListeners();
	}

	makeWall(x, y){
		this.grid[y][x] = 1;
		this.viewRenderer.makeWall(x, y);
	}

	bindEventListeners(){
		this.viewRenderer.tableElement.on('dragover', (event) => {
			let coords = $(event.target).data("coords");
			this.makeWall(coords.x, coords.y);
		});

		this.viewRenderer.tableElement.on('click', (event) => {
			let coords = $(event.target).data("coords");
			this.makeWall(coords.x, coords.y);
		});

		this.viewRenderer.tableElement.on('dragstart', (event) => {
			let coords = $(event.target).data("coords");
			this.makeWall(coords.x, coords.y);
		});
	}
}

export default Controller;
