import Denque from 'denque';
import backTrace from '../utils/BackTrace';

export default class MultiBFS{
	constructor(options){
		console.log(options);
		this.allowDiagonal = options.allowDiagonal;
		this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
		this.markCurrentProcessingNode = options.markCurrentProcessingNode;
	}

	findPath(multiEPGrid){
		let startPoint = multiEPGrid.startPoint,
			startNode = multiEPGrid.getNodeAtXY(startPoint.x, startPoint.y),
			queue = new Denque([startNode]),
			currentProcessingNode,
			neighbours,
			path = [],
			currentFlagID = 1;

		startNode.addedToQueue = true;
		while(!queue.isEmpty()){
			currentProcessingNode = queue.shift();

			if(this.markCurrentProcessingNode) currentProcessingNode.currentNode = true;

			if(multiEPGrid.isXYEndPoint(currentProcessingNode.x, currentProcessingNode.y)){
				path = path.concat(backTrace.backTrace(currentProcessingNode, startNode));
				startNode = currentProcessingNode;
				multiEPGrid.removeEndPoint(currentProcessingNode);
				// console.log(path, multiEPGrid.endPoints);
				queue.clear();
				currentFlagID++;
				if(!multiEPGrid.endPoints.length) return path;
			}

			neighbours = multiEPGrid.getNeighbours(currentProcessingNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);
			neighbours.forEach(neighbour => {
				if(neighbour.addedToQueue === currentFlagID || neighbour.visited === currentFlagID) return;

				neighbour.addedToQueue = currentFlagID;
				queue.push(neighbour);
				neighbour.parent = currentProcessingNode;
			});

			currentProcessingNode.visited = currentFlagID;
		}

		return path;
	}
}
