import Denque from 'denque';
import backTrace from '../utils/BackTrace';

export default class BreadthFirstSearch{
	constructor(opts){
		console.log(opts);
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
			currentProcessingNode.currentNode = true;
			
			if(currentProcessingNode === endNode){
				return backTrace.backTrace(endNode, startNode);
			}
			
			neighbours = grid.getNeighbours(currentProcessingNode);
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
}
