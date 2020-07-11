import Heap from 'heap';
import backTrace from '../utils/BackTrace';
import heuristics from '../utils/Heuristics';

export default class AStar{
	constructor(options){
		console.log(options);
		this.allowDiagonal = options.allowDiagonal;
		this.biDirectional = options.biDirectional;
		this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
		this.markCurrentProcessingNode = options.markCurrentProcessingNode;

		this.heuristic = heuristics[options.heuristic];
		if(this.biDirectional){
			this.findPath = this.findBiPath;
		}
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
		endNode.f = 0;
		endNode.g = 0;

		minHeap.insert(startNode);
		startNode.addedToHeap = true;

		while(!minHeap.empty()){
			currentProcessingNode = minHeap.pop();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;

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

	findBiPath(grid){
		let minHeapFromStart = new Heap((node1, node2) => node1.f-node2.f), 
			minHeapFromEnd = new Heap((node1, node2) => node1.f-node2.f), 
			startNode = grid.getNodeAtXY(grid.startPoint.x, grid.startPoint.y), 
			endNode = grid.getNodeAtXY(grid.endPoint.x, grid.endPoint.y), 
			currentProcessingNode, 
			neighbours, 
			neighbour,
			neighbourGValFromCurrentProcessingNode;
		
		startNode.f = 0;
		startNode.g = 0;
		endNode.f = 0;
		endNode.g = 0;

		minHeapFromStart.insert(startNode);
		startNode.addedToHeap = true;
		startNode.by = 'start';
		minHeapFromEnd.insert(endNode);
		endNode.addedToHeap = true;
		endNode.by = 'end';

		while(!minHeapFromStart.empty() && !minHeapFromEnd.empty()){

			currentProcessingNode = minHeapFromStart.pop();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			neighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);

			while(neighbours.length){
				neighbour = neighbours.shift();
				if(neighbour.visited){
					continue;
				}
				neighbourGValFromCurrentProcessingNode = currentProcessingNode.g+this.getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour);
				if(!neighbour.addedToHeap){
					neighbour.g = neighbourGValFromCurrentProcessingNode;
					neighbour.h = this.heuristic(endNode, neighbour);
					neighbour.f = neighbour.g+neighbour.h;

					minHeapFromStart.insert(neighbour);
					neighbour.addedToHeap = true;
					neighbour.parent = currentProcessingNode;
					neighbour.by = 'start';

				} else {
					if(neighbour.by === 'end'){
						return backTrace.biBackTrace(currentProcessingNode, startNode, neighbour, endNode);
					}
					if(neighbour.g > neighbourGValFromCurrentProcessingNode){
						neighbour.g = neighbourGValFromCurrentProcessingNode;
						neighbour.h = this.heuristic(endNode, neighbour);
						neighbour.f = neighbour.g+neighbour.h;

						minHeapFromStart.updateItem(neighbour);
						neighbour.parent = currentProcessingNode;
						neighbour.by = 'start';
					}
				}
			}
			currentProcessingNode.visited = true;

			currentProcessingNode = minHeapFromEnd.pop();
			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;
			neighbours = grid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
			
			while(neighbours.length){
				neighbour = neighbours.shift();
				if(neighbour.visited){
					continue;
				}
				neighbourGValFromCurrentProcessingNode = currentProcessingNode.g+this.getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour);
				if(!neighbour.addedToHeap){
					neighbour.g = neighbourGValFromCurrentProcessingNode;
					neighbour.h = this.heuristic(startNode, neighbour);
					neighbour.f = neighbour.g+neighbour.h;

					minHeapFromEnd.insert(neighbour);
					neighbour.addedToHeap = true;
					neighbour.parent = currentProcessingNode;
					neighbour.by = 'end';

				} else {
					if(neighbour.by === 'start'){
						return backTrace.biBackTrace(neighbour, startNode, currentProcessingNode, endNode);
					}
					if(neighbour.g > neighbourGValFromCurrentProcessingNode){
						neighbour.g = neighbourGValFromCurrentProcessingNode;
						neighbour.h = this.heuristic(startNode, neighbour);
						neighbour.f = neighbour.g+neighbour.h;

						minHeapFromEnd.updateItem(neighbour);
						neighbour.parent = currentProcessingNode;
						neighbour.by = 'end';
					}
				}
			}
			currentProcessingNode.visited = true;
		}

	}
}
