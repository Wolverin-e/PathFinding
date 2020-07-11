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

			neighbours = grid.getNeighbours(currentProcessingNode,this.allowDiagonal,this.doNotCrossCorners);
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
		let startNode = grid.getNodeAtXY(grid.startPoint.x, grid.startPoint.y), 
			endNode = grid.getNodeAtXY(grid.endPoint.x, grid.endPoint.y), 
			neighbour,
			currentProcessingNode,
			startNeighbours = [],
			endNeighbours = [];

		let startQueue = new Denque([startNode]),
			endQueue = new Denque([endNode]);
			
		startNode.addedToQueue = true;
		endNode.addedToQueue = true;
		startNode.by = 'start';
		endNode.by = 'end';

		while(!startQueue.isEmpty() && !endQueue.isEmpty()){
			currentProcessingNode = startQueue.shift();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			startNeighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
		
			while(startNeighbours.length){
				neighbour = startNeighbours.shift();
				if(neighbour.visited){
					continue;
				}
				if(neighbour.addedToQueue){
					if(neighbour.by === 'end'){
						return backTrace.biBackTrace(currentProcessingNode,startNode,neighbour,endNode);
					}
					continue;
				}
				startQueue.push(neighbour);
				neighbour.parent = currentProcessingNode;
				neighbour.by = 'start';
				neighbour.addedToQueue = true;
			}

			currentProcessingNode.visited = true;
			
			currentProcessingNode = endQueue.shift();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			endNeighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);

			while(endNeighbours.length){
				neighbour = endNeighbours.shift();
				if(neighbour.visited){
					continue;
				}
				if(neighbour.addedToQueue){
					if(neighbour.by === 'start'){
						return backTrace.biBackTrace(neighbour,startNode,currentProcessingNode,endNode);
					}
					continue;
				}
				endQueue.push(neighbour);
				neighbour.addedToQueue = true;
				neighbour.parent=currentProcessingNode;
				neighbour.by='end';
			}

			currentProcessingNode.visited = true;
		}
		return [];		
	}
}	
	
