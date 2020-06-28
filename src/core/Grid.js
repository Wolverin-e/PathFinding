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

	changeIntensity(i, j, table){
		this.matrix[i][j] = 1;
		// $(table.children()[i-1].children[j-1]).css("background-color", "black")
		$(table.children()[i-1].children[j-1]).addClass("wallElem");
	}

	invertIntensity(initial, target){
		const {x, y} = target.data("coords");
		if(initial){
			this.matrix[y][x] = 0;
			target.removeClass("wallElem");
		} else {
			this.matrix[y][x] = 1;
			target.addClass("wallElem");
		}
	}
}

module.exports = Grid;
