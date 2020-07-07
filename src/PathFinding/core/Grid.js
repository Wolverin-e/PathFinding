import GraphNode from './GraphNode';

class Grid{
	constructor(options){
		this.rows = options.rows;
		this.columns = options.columns;
		this.startPoint = options.startPoint;
		this.endPoint = options.endPoint;

		for(let y=0; y<this.rows; y++){
			this[y] = new Array(this.columns);
			for(let x=0; x<this.columns; x++){
				this[y][x] = new GraphNode({x, y});
			}
		}
	}

	isXYWallElement(x, y){
		if(x<0 || x>=this.columns || y<0 || y>=this.rows) return true;
		return (this[y][x].isWall?true:false);
	}

	makeXYWall(x, y){
		this[y][x].isWall = true;
	}

	destroyWallAtXY(x, y){
		this[y][x].isWall = false;
	}

	isXYStartPoint(x, y){
		return ((this.startPoint.x === x )&&(this.startPoint.y === y));
	}

	isXYEndPoint(x, y){
		return ((this.endPoint.x === x )&&(this.endPoint.y === y));
	}

	getNodeAtXY(x, y){
		return this[y][x];
	}

	clone(){
		let grid = new Grid(this);

		for(let y=0; y<this.rows; y++){
			grid[y] = new Array(this.columns);
			for(let x=0; x<this.columns; x++){
				grid[y][x] = new GraphNode({x, y});
				if(this.isXYWallElement(x, y)) grid.makeXYWall(x, y);
			}
		}
		return grid;
	}

	/*
		|_ _|_a_|_ _| |_p_|_ _|_q_| 
		|_d_|_*_|_b_| |_ _|_*_|_ _|
		|_ _|_c_|_ _| |_s_|_ _|_r_|
	 */
	getNeighbours(node){
		let neighbours = [];
		const {x, y} = node;
		let a, b, c, d;

		// all movable;
		
		// a
		if(!this.isXYWallElement(x, y-1)) {
			neighbours.push(this.getNodeAtXY(x, y-1));
			a = true;
		}
		// b
		if(!this.isXYWallElement(x+1, y)) {
			neighbours.push(this.getNodeAtXY(x+1, y));
			b = true;
		}
		// c
		if(!this.isXYWallElement(x, y+1)) {
			neighbours.push(this.getNodeAtXY(x, y+1));
			c = true;
		}
		// d
		if(!this.isXYWallElement(x-1, y)) {
			neighbours.push(this.getNodeAtXY(x-1, y));
			d = true;
		}

		//p
		if( (a || d) & !this.isXYWallElement(x-1, y-1)) {
			neighbours.push(this.getNodeAtXY(x-1, y-1));
		}
		//q
		if( (a || b) & !this.isXYWallElement(x+1, y-1)) {
			neighbours.push(this.getNodeAtXY(x+1, y-1));
		}
		//r
		if( (b || c) & !this.isXYWallElement(x+1, y+1)) {
			neighbours.push(this.getNodeAtXY(x+1, y+1));
		}
		//s
		if( (c || d) & !this.isXYWallElement(x-1, y+1)) {
			neighbours.push(this.getNodeAtXY(x-1, y+1));
		}
		return neighbours;
	}
}

export default Grid;
