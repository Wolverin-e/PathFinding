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
}

export default new BackTrace();
