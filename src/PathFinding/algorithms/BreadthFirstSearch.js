import Denque from 'denque';
import backTrace from '../utils/BackTrace';

export default class BreadthFirstSearch{
	constructor(options){
		console.log(options);
		this.allowDiagonal = options.allowDiagonal;
		this.biDirectional = options.biDirectional;
		this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
		this.markCurrentProcessingNode = options.markCurrentProcessingNode;

		if(this.biDirectional){
			this.findPath = this.findBiPath;
		}
	}

	findPath(grid){
		let startPoint = grid.startPoint, 
			endPoint = grid.endPoint, 
			startNode = grid[startPoint.y][startPoint.x], 
			endNode = grid[endPoint.y][endPoint.x];

		let queue = new Denque([startNode]), 
			neighbours = [], 
			currentProcessingNode;
		startNode.addedToQueue = true;

		while(!queue.isEmpty()){

			currentProcessingNode = queue.shift(); // Dequeue operation on queue
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			
			if(currentProcessingNode === endNode){
				return backTrace.backTrace(endNode, startNode);
			}
			
			neighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
			neighbours.forEach(neighbour => {
				if(neighbour.visited || neighbour.addedToQueue){
					return; // equivalent to CONTINUE in forEach
				}
				queue.push(neighbour);
				neighbour.addedToQueue = true;
				neighbour.parent = currentProcessingNode;
			});
			currentProcessingNode.visited = true;
		}

		return [];
	}

	findBiPath(grid){
		console.log(grid);
	}
}
