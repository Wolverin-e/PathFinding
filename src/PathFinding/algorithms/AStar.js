import Heap from 'heap';
import backTrace from '../utils/BackTrace';
import heuristics from '../utils/Heuristics';

export default class AStar{
	constructor(options){
		console.log(options);
		this.allowDiagonal = options.allowDiagonal;
		this.biDirectional = options.biDirectional;
		this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
		this.heuristic = heuristics[options.heuristic];
	}

	getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour){
		if((Math.abs(currentProcessingNode.x-neighbour.x)+Math.abs(currentProcessingNode.y-neighbour.y))===1){
			return 1;
		}
		return Math.SQRT2;
	}

	findPath(grid){
		let minHeap = new Heap((node1, node2) => node1.f-node2.f), 
			startNode = grid.getNodeAtXY(grid.startPoint.x, grid.startPoint.y), 
			endNode = grid.getNodeAtXY(grid.endPoint.x, grid.endPoint.y), 
			currentProcessingNode, 
			neighbours, 
			neighbourGValFromCurrentProcessingNode;
		
		startNode.f = 0;
		startNode.g = 0;

		minHeap.insert(startNode);
		startNode.addedToHeap = true;

		while(!minHeap.empty()){
			currentProcessingNode = minHeap.pop();
			currentProcessingNode.currentNode = true;

			if(currentProcessingNode === endNode){
				return backTrace.backTrace(currentProcessingNode, startNode);
			}

			neighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);

			neighbours.forEach(neighbour => {
				if(neighbour.visited) return; //equivalent to continue in forEach
				
				neighbourGValFromCurrentProcessingNode = currentProcessingNode.g+this.getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour);

				if(!neighbour.addedToHeap){
					neighbour.g = neighbourGValFromCurrentProcessingNode;
					neighbour.h = this.heuristic(endNode, neighbour);
					neighbour.f = neighbour.g+neighbour.h;

					minHeap.insert(neighbour);
					neighbour.addedToHeap = true;
					neighbour.parent = currentProcessingNode;

				} else if(neighbour.g > neighbourGValFromCurrentProcessingNode){
					neighbour.g = neighbourGValFromCurrentProcessingNode;
					neighbour.h = this.heuristic(endNode, neighbour);
					neighbour.f = neighbour.g+neighbour.h;

					minHeap.updateItem(neighbour);
					neighbour.parent = currentProcessingNode;
				}
			});

			currentProcessingNode.visited = true;
		}

		return [];
	}
}
