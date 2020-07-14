import Grid from './Grid';

class MultiEPGrid extends Grid{
	constructor(options){
		super(options);

		this.endPoints = options.endPoints;
	}

	isXYEndPoint(x, y){
		return (this.endPoints.some(ep => (ep.x===x)&&(ep.y===y)));
	}

	shiftEndPoint(from, to){
		let i = this.endPoints.findIndex(ep => (ep.x===from.x)&&(ep.y===from.y));
		if(i!=-1){
			this.endPoints[i] = to;
		}
	}

	clone(){
		let grid = new MultiEPGrid(this);

		for(let y=0; y<this.rows; y++){
			for(let x=0; x<this.columns; x++){
				if(this.isXYWallElement(x, y)) grid.makeXYWall(x, y);
			}
		}
		return grid;
	}
}

export default MultiEPGrid;
