class BackTrace{
	backTrace(node, startNode){
		let path = [];
		while(node !== startNode){
			path.push(node);
			node = node.parent;
		}
		path.reverse();
		return path;
	}
	
	biBackTrace(node1, startNode, node2, endNode){
		let path1 = this.backTrace(node1, startNode),
			path2 = this.backTrace(node2, endNode);
		path2.reverse();
		let path = path1.concat(path2);
		return path;
	}

	interpolation(grid, firstNode, secondNode){
		let x1 = firstNode.x,
			y1 = firstNode.y,
			x2 = secondNode.x,
			y2 = secondNode.y,
			xDifference = Math.abs(x2 - x1),
			yDifference = Math.abs(y2 - y1),
			xDirection = (x2>x1) ? 1 : -1,
			yDirection = (y2>y1) ? 1 : -1,
			interpolatedValues = [],
			intermidateDistance;
			
		intermidateDistance = xDifference - yDifference;

		while((x1 !== x2) || (y1 !== y2)){
			interpolatedValues.push(firstNode);
			if (2 *intermidateDistance > -yDifference){
				intermidateDistance = intermidateDistance - yDifference;
				x1 = x1 +xDirection;
			}else if (2*intermidateDistance < xDifference){
				intermidateDistance = intermidateDistance +xDifference;
				y1 = y1 +yDirection;
			}
			firstNode = grid.getNodeAtXY(x1, y1);
		}
		return interpolatedValues;
	}

	expandPath(grid, path, startNode){
		let expandedPath =[],
			firstNode,
			secondNode,
			interpolatedValues = [];

		firstNode = startNode;
		while(path.length){
			secondNode = path.shift();
			interpolatedValues = this.interpolation(grid, firstNode, secondNode);
			while(interpolatedValues.length){
				expandedPath.push(interpolatedValues.shift());
			}
			firstNode = secondNode;
		}	
		
		expandedPath.push(secondNode);
		expandedPath.shift();
		return expandedPath;
	}
}
export default new BackTrace();
