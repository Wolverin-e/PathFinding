const Node= require('./Nodes');

class Grid{
	constructor(options){
		this.rows = options.rows;
		this.columns = options.columns;
		this.startPoint = options.startPoint;
		this.endPoint = options.endPoint;

		for(let x=0; x<this.rows; x++){
			for(let y=0;y<this.columns;y++){
				this[x][y]=new Node(x,y);
			}
		}
	}

	neighbours(Node,DigonalMovement,CrossCorner){

		let neighboursList=[];
		let left_upCorner=true;
		let left_bottomCorner=true;
		let right_upCorner=true;
		let right_bottomCorner=true;

		if (x!==0){
			if (this[Node.x -1][Node.y].obstacle==false){
					neighboursList.append(this[Node.x -1][Node.y]);
						}
			else{
				if (CrossCorner==false){
					left_upCorner=false;
					left_bottomCorner=false;
				}
			}
				}
		if (x!==this.columns-1){
			if (this[Node.x +1][Node.y].obstacle==false){
				neighboursList.append(this[Node.x+1][Node.y]);
							}
			else{
				if (CrossCorner==false){
					right_upCorner=false;
					right_bottomCorner=false;
				}
			}
				}
		if (y!==0){
			if (this[Node.x][Node.y -1].obstacle==false){
				neighboursList.append(this[Node.x][Node.y -1]);
					}
			else{
				if (CrossCorner=false){
					left_upCorner=false;
					right_upCorner=false;
				}
			}
				}
		if (y!==this.rows -1){
			if (this[Node.x][Node.y +1].obstacle==false){
				neighboursList.append(this[Node.x][Node.y +1]);
					}
			else{
				if (CrossCorner=false){
					left_bottomCorner=false;
					right_bottomCorner=false;
				}
			}
				}
		if (DigonalMovement==true){
			if (x!==0 && y!==0){
				if (this[Node.x-1][Node.y -1].obstacle==false && left_upCorner==true){
					neighboursList.append(this[Node.x-1][Node.y-1]);
					}
				}
			if (x!==0 && y!==this.rows-1){
				if (this[Node.x-1][Node.y +1].obstacle==false && left_bottomCorner==true){
					neighboursList.append(this[Node.x-1][Node.y+1]);
					}
				}
			if (x!==this.columns-1 && y!==0){
				if (this[Node.x+1][Node.y -1].obstacle==false && right_upCorner==true){
					neighboursList.append(this[Node.x+1][Node.y-1]);
					}
				}
			if (x!==this.columns-1 && y!==this.rows-1){
				if (this[Node.x+1][Node.y +1].obstacle==false && right_bottomCorner==true){
					neighboursList.append(this[Node.x+1][Node.y+1]);
					}
				}
			}	
			return neighboursList;
		}
	}
module.exports = Grid;
