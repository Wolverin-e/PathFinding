import Heap from 'heap';
import backTrace from '../utils/BackTrace';
import heuristics from '../utils/Heuristics';

export default class MultiAStar{
	constructor(options){
		console.log(options);
		this.allowDiagonal = options.allowDiagonal;
		this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
		this.markCurrentProcessingNode = options.markCurrentProcessingNode;
		this.heuristic = heuristics[options.heuristic];
	}

	getDistanceFromCurrentProcessignNode(currentProcessingNode, neighbour){
		if((Math.abs(currentProcessingNode.x-neighbour.x)+Math.abs(currentProcessingNode.y-neighbour.y))===1){
			return 1;
		}
		return Math.SQRT2;
	}

	findPath(multiEPGrid){
		let endNodesList = [],
			multiEPGridPass,
			startNode = multiEPGrid.getNodeAtXY(multiEPGrid.startPoint.x, multiEPGrid.startPoint.y),
			endPoint,
			endNode,
			closestEndNode,
			path = [],
			subPath = [];

		// console.log(startNode);
		// console.log(multiEPGrid.endPoints);

		for(let i=0;i<multiEPGrid.endPoints.length;i++){
			endPoint = multiEPGrid.endPoints[i];
			endNode = multiEPGrid.getNodeAtXY(endPoint.x, endPoint.y);
			endNodesList.push(endNode);
			endNode.h = heuristics['euclidean'](endNode, startNode);

		}
		endNodesList.sort(function(node1, node2){
			return node1.h - node2.h;
		});

		while(endNodesList.length){

			multiEPGridPass = multiEPGrid.clone();
			closestEndNode = endNodesList.shift();
			subPath = this.finder(startNode, closestEndNode, multiEPGridPass);
			// console.log(subPath);

			if (subPath.length){
				if ((subPath[subPath.length -1].x === closestEndNode.x) && (subPath[subPath.length -1].y === closestEndNode.y)){
					multiEPGrid.removeEndPoint(closestEndNode);
				}else{
					endNodesList.push(closestEndNode);
					multiEPGrid.removeEndPoint(subPath[subPath.length -1]);
					for (let k=0;k<endNodesList.length;k++){
						endNode = endNodesList[k];
						if ((endNode.x === subPath[subPath.length -1].x) && (endNode.y === subPath[subPath.length -1].y)){
							endNodesList.splice(k, 1);
							// console.log(endNodesList);
							break;
						}
					}
				}
				path = path.concat(subPath);
				startNode = subPath[subPath.length -1];
			}

			for (let i=0;i<endNodesList.length;i++){
				endNode = endNodesList[i];
				endNode.h = heuristics['euclidean'](endNode, startNode);
			}
			endNodesList.sort(function(node1, node2){
				return node1.h - node2.h;
			});
		}
		return path;
	}

	finder(startNode, endNode, multiEPGrid){
		let minHeap = new Heap((node1, node2) => node1.f-node2.f),
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
			if (multiEPGrid.isXYEndPoint(currentProcessingNode.x, currentProcessingNode.y)){
				return backTrace.backTrace(currentProcessingNode, startNode);
			}
			neighbours = multiEPGrid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);

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
