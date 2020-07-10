let abs = Math.abs, 
	sqrt = Math.sqrt, 
	max = Math.max, 
	min = Math.min;

class Heuristic{

	constructor(){
		this.weight = 1;
	}

	manhattan(nodeA, nodeB){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return this.weight*(dx+dy);
	}

	euclidean(nodeA, nodeB){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return this.weight*sqrt(dx*dx + dy*dy);
	}

	octile(nodeA, nodeB){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return max(dx, dy)+(sqrt(2)-1)*min(dx, dy);
	}

	chebyshev(nodeA, nodeB){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return max(dx, dy);
	}
}

export default new Heuristic();
