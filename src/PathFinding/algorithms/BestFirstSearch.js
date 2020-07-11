import AStar from './AStar';

export default class BestFirstSearch extends AStar{
	constructor(options){
		super(options);

		let heuristicToOverride = this.heuristic;

		this.heuristic = (node1, node2) => {
			return heuristicToOverride(node1, node2, 500000);
		};
	}
}
