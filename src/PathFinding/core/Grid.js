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
}

module.exports = Grid;
