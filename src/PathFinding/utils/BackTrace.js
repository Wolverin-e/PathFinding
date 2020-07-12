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
}

export default new BackTrace();
