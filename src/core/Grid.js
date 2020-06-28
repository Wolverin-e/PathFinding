class Grid{
	constructor(rows, cols){
		this.matrix = [];
		for(let i=1; i<rows; i++){
			this.matrix[i] = [];
			for(let j=1; j<cols; j++){
				this.matrix[i][j] = 0;
			}
		}
	}

	changeIntensity(i, j){
		this.matrix[i][j] = 1;
	}
}

module.exports = Grid;
