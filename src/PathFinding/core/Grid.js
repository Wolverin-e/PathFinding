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
}

export default Grid;
