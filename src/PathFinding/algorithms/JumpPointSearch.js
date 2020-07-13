import Heap from 'heap';
import backTrace from '../utils/BackTrace';
import heuristics from '../utils/Heuristics';

export default class JumpPointSearch{
	constructor(options){
		console.log(options);
		this.markCurrentProcessingNode = options.markCurrentProcessingNode;
		this.heuristic = heuristics[options.heuristic];
	}
    
	getNeighboursBasedOnOptions(currentProcessingNode){
		let parent = currentProcessingNode.parent,
			abs = Math.abs,
			max = Math.max,
			parentX,
			parentY,
			xNormalizeDirection,
			yNormalizeDirection,
			x = currentProcessingNode.x,
			y = currentProcessingNode.y,
			neighbours = [];
		if (parent){
			parentX = parent.x;
			parentY = parent.y;
			xNormalizeDirection = (x -parentX)/(max(abs(x -parentX), 1));
			yNormalizeDirection = (y -parentY)/(max(abs(y - parent.y), 1));

			if (xNormalizeDirection !== 0){
				if (!this.grid.isXYWallElement(x, y-1)){
					neighbours.push(this.grid.getNodeAtXY(x, y-1));
				}
				if (!this.grid.isXYWallElement(x, y+1)){
					neighbours.push(this.grid.getNodeAtXY(x, y+1));
				}
				if (!this.grid.isXYWallElement(x+xNormalizeDirection, y)){
					neighbours.push(this.grid.getNodeAtXY(x+xNormalizeDirection, y));
				}
			}
			if (yNormalizeDirection !== 0){
				if (!this.grid.isXYWallElement(x-1, y)){
					neighbours.push(this.grid.getNodeAtXY(x-1, y));
				}
				if (!this.grid.isXYWallElement(x+1, y)){
					neighbours.push(this.grid.getNodeAtXY(x+1, y));
				}
				if (!this.grid.isXYWallElement(x, y+yNormalizeDirection)){
					neighbours.push(this.grid.getNodeAtXY(x, y+yNormalizeDirection));
				}
			}
		}else{
			neighbours = this.grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
		}
		return neighbours;
	}

	getJumpPoints(currentProcessingNode, parent){
		let x = currentProcessingNode.x,
			y = currentProcessingNode.y,
			parentX = parent.x,
			parentY = parent.y,
			xDifference = currentProcessingNode.x - parent.x,
			yDifference = currentProcessingNode.y - parent.y;
		console.log(currentProcessingNode);
		if (this.grid.isXYWallElement(x, y)){
			return null;
		}
		if ((x === 0) || (x === this.grid.columns -1 ) || (y === 0) || (y === this.grid.rows -1)){
			return null;
		}
		if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
        
		if (currentProcessingNode === this.grid.endNode){
			return currentProcessingNode;
		}
    
		if (xDifference !== 0){
			if ((!this.grid.isXYWallElement(x, y-1) && this.grid.isXYWallElement(parentX, y-1)) || (!this.grid.isXYWallElement(x, y+1) && this.grid.isXYWallElement(parentX, y+1))){
				return currentProcessingNode;
			}
		}else if (yDifference !== 0){
			if ((!this.grid.isXYWallElement(x-1, y) && this.grid.isXYWallElement(x-1, parentY)) || (!this.grid.isXYWallElement(x+1, y) && this.grid.isXYWallElement(x+1, parentY))){
				return currentProcessingNode; 
			}
			if (this.getJumpPoints(this.grid.getNodeAtXY(x+1, y), currentProcessingNode) || this.getJumpPoints(this.grid.getNodeAtXY(x-1, y), currentProcessingNode)){
				return currentProcessingNode;
			}
		}else {
			console.log('only vertical and horizontal movements allowed');
		}
		return this.getJumpPoints(this.grid.getNodeAtXY(x+xDifference, y+yDifference), currentProcessingNode);
	}        
    
	successor(currentProcessingNode){

		let neighbours = [],
			jumpPointNode,
			neighbour,
			jumpPointDistanceFromStart;
		neighbours = this.getNeighboursBasedOnOptions(currentProcessingNode);
    
		while(neighbours.length){
			neighbour = neighbours.shift();
			jumpPointNode = this.getJumpPoints(neighbour, currentProcessingNode);
			if (jumpPointNode){
				if (jumpPointNode.visited){
					continue;
				}
				jumpPointDistanceFromStart = currentProcessingNode.g + heuristics['octile'](jumpPointNode, currentProcessingNode);
				if(!jumpPointNode.addedToHeap || jumpPointDistanceFromStart<jumpPointNode.g){
					jumpPointNode.g = jumpPointDistanceFromStart;
					jumpPointNode.h = this.heuristic(this.grid.endNode, jumpPointNode);
					jumpPointNode.f = jumpPointNode.g+jumpPointNode.h;
					jumpPointNode.parent = currentProcessingNode;

					if (!jumpPointNode.addedToHeap){
						this.minHeap.insert(jumpPointNode);
						jumpPointNode.addedToHeap = true;
					}

				} else {
					this.minHeap.updateItem(jumpPointNode);
				}
			}
		}
	}

	findPath(grid){
		this.grid = grid;
		let minHeap = new Heap((node1, node2) => node1.f-node2.f), 
			currentProcessingNode;
		this.minHeap = minHeap;
        
		this.grid.startNode = this.grid.getNodeAtXY(this.grid.startPoint.x, this.grid.startPoint.y);  
		this.grid.endNode = this.grid.getNodeAtXY(this.grid.endPoint.x, this.grid.endPoint.y);
		this.grid.startNode.g = 0;
		this.grid.startNode.f = 0;
		this.minHeap.insert(this.grid.startNode);
		this.grid.startNode.addedToHeap = true;
        
		while(!this.minHeap.empty()){

			currentProcessingNode = this.minHeap.pop();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			currentProcessingNode.visited = true;

			if (currentProcessingNode === this.grid.endNode){
				let jumpPoints = backTrace.backTrace(this.grid.endNode, this.grid.startNode);
				let path = backTrace.expandPath(this.grid, jumpPoints, this.grid.startNode);
				console.log(path);
				return path;
			}
			this.successor(currentProcessingNode);
		}
		return [];
	}
}
