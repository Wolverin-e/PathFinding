class Grid{
	constructor(options){
		this.rows = options.rows;
		this.columns = options.columns;
		this.startPoint = options.startPoint;
		this.endPoint = options.endPoint;

		for(let y=0; y<this.rows; y++){
			this[y] = new Array(this.columns).fill(0);
		}
	}

	isXYWallElement(x, y){
		return (this[y][x] === 1);
	}

	isXYStartPoint(x, y){
		return ((this.startPoint.x === x )&&(this.startPoint.y === y));
	}

	isXYEndPoint(x, y){
		return ((this.endPoint.x === x )&&(this.endPoint.y === y));
	}
}

module.exports = Grid;
