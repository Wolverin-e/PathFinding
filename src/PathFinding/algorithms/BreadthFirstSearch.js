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
			currentProcessingNode.visited = true;

			if(currentProcessingNode === endNode){
				return backTrace.backTrace(endNode, startNode);}
			neighbours = grid.getNeighbours(currentProcessingNode,this.allowDiagonal,this.doNotCrossCorners);
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

	findBiPath(grid){
		let startNode = grid.getNodeAtXY(grid.startPoint.x, grid.startPoint.y), 
			endNode = grid.getNodeAtXY(grid.endPoint.x, grid.endPoint.y), 
			neighbour,
			currentProcessingNode,
			neighboursStart = [],
			neighboursEnd = [];

		let startqueue = new Denque([startNode]),
			endqueue = new Denque([endNode]);
			
		startNode.addedToQueue = true;
		endNode.addedToQueue = true;
		startNode.by = 'start';
		endNode.by = 'end';

		while(!startqueue.isEmpty() && !endqueue.isEmpty()){
			currentProcessingNode = startqueue.shift();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			currentProcessingNode.visited = true;
			neighboursStart = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
		
			while(neighboursStart.length){
				neighbour = neighboursStart.shift();
				if(neighbour.visited){
					continue;
				}
				if(neighbour.addedToQueue){
					if(neighbour.by === 'end'){
						return backTrace.biBackTrace(currentProcessingNode,startNode,neighbour,endNode);
					}
					continue;
				}
				startqueue.push(neighbour);
				neighbour.parent = currentProcessingNode;
				neighbour.by = 'start';
				neighbour.addedToQueue = true;
			}
			
			currentProcessingNode = endqueue.shift();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			currentProcessingNode.visited = true;
			neighboursEnd = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);

			while(neighboursEnd.length){
				neighbour = neighboursEnd.shift();
				if(neighbour.visited){
					continue;
				}
				if(neighbour.addedToQueue){
					if(neighbour.by === 'start'){
						return backTrace.biBackTrace(neighbour,startNode,currentProcessingNode,endNode);
					}
					continue;
				}
				endqueue.push(neighbour);
				neighbour.addedToQueue = true;
				neighbour.parent=currentProcessingNode;
				neighbour.by='end';

			}
		}
		return [];		
	}
}	
	
