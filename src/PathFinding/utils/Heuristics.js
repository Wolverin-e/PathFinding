let abs = Math.abs, 
	sqrt = Math.sqrt, 
	max = Math.max, 
	min = Math.min;

class Heuristic{

	manhattan(nodeA, nodeB, weight=1){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return weight*(dx+dy);
	}

	euclidean(nodeA, nodeB, weight=1){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return weight*sqrt(dx*dx + dy*dy);
	}

	octile(nodeA, nodeB, weight=1){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return weight*(max(dx, dy)+(sqrt(2)-1)*min(dx, dy));
	}

	chebyshev(nodeA, nodeB, weight=1){
		let dx = abs(nodeA.x-nodeB.x);
		let dy = abs(nodeA.y-nodeB.y);
		return weight*(max(dx, dy));
	}
}

export default new Heuristic();
