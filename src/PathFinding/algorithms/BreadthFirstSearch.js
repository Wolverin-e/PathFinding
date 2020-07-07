import Denque from 'denque';

export default class BreadthFirstSearch{
	constructor(opts){
		console.log(opts);
	}

	backTrace(node, startNode){
		let path = [];
		while(node !== startNode){
			path.push(node);
			node = node.parent;
		}
		console.log(path);
		return path;
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

			currentProcessingNode = queue.shift();
			currentProcessingNode.visited = true;

			if(currentProcessingNode === endNode){
				// console.log(currentProcessingNode, endNode);
				return this.backTrace(endNode, startNode);
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
		}

		return [];
	}
}
