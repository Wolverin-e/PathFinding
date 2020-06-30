class Grid{
	constructor(options){
		this.rows = options.rows;
		this.columns = options.columns;

		for(let y=0; y<this.rows; y++){
			this[y] = new Array(this.columns).fill(0);
		}
	}
}

module.exports = Grid;
