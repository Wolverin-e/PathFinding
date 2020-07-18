import heuristics from '../utils/Heuristics';

Array.prototype.peekTop = function(){
	return this.length?this[this.length-1]:undefined;
};

export default class IDAStar{
	constructor(options){
		this.allowDiagonal = options.allowDiagonal;
		this.doNotCrossCornersBetweenObstacles = options.doNotCrossCornersBetweenObstacles;
		this.markCurrentProcessingNode = options.markCurrentProcessingNode;

		this.heuristic = heuristics[options.heuristic];
		// this.heuristic = heuristics["euclidean"];
		this.timeLimit = 100;
	}

	getDistanceFromRootNode(rootNode, neighbour){
		if((Math.abs(rootNode.x-neighbour.x)+Math.abs(rootNode.y-neighbour.y))===1){
			return 1;
		}
		return Math.SQRT2;
	}

	timeUp(){
		return (Math.abs(this.startTime - new Date())>this.timeLimit);
	}

	findPath(grid){
		this.grid = grid;
		let uppperBound = this.heuristic(grid.startPoint, grid.endPoint),
			returnedInstance;

		grid.startNode = grid.getNodeAtXY(grid.startPoint.x, grid.startPoint.y);
		grid.endNode = grid.getNodeAtXY(grid.endPoint.x, grid.endPoint.y);

		this.startTime = new Date();
		let path = [ grid.startNode ];

		while(true){
			returnedInstance = this.search(path, 0, uppperBound);

			if(typeof(returnedInstance) === "number"){
				console.info("bound Increased to", returnedInstance);
				uppperBound = returnedInstance;
			} else if(returnedInstance === "FOUND"){
				return path;
			} else {
				return returnedInstance;
			}
		}
	}

	search(path, rootGVal, upperBound){
		let rootNode = path.peekTop();
		if(this.timeUp()) {
			console.info("time exceeded");
			return [];
		}

		if(rootNode === this.grid.endNode){
			console.info("found");
			return "FOUND";
		}

		let fVal = rootGVal + this.heuristic(rootNode, this.grid.endNode);
		if(fVal > upperBound) {
			rootNode.explored = true;
			return fVal;
		}

		if(this.markCurrentProcessingNode) rootNode.currentNode = true;
		rootNode.visited = true;

		let min = Infinity,
			neighbourGVal,
			returnedInstance,
			neighbour,
			neighbours = this.grid.getNeighbours(rootNode, this.allowDiagonal, this.doNotCrossCornersBetweenObstacles);

		while(neighbours.length){
			neighbour = neighbours.shift();
			if(!path.includes(neighbour)){
				path.push(neighbour);
				neighbourGVal = rootGVal+this.getDistanceFromRootNode(rootNode, neighbour);

				returnedInstance = this.search(path, neighbourGVal, upperBound);

				if((typeof(returnedInstance) === "number") && (returnedInstance < min)){
					min = returnedInstance;
				} else if(returnedInstance === "FOUND"){
					return returnedInstance;
				}
				path.pop(neighbour);
			}
		}

		rootNode.visited = false;
		return min;
	}
}
