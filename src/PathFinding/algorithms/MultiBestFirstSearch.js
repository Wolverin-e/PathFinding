import MultiAStar from './MultiAStar';

export default class MultiBestFirstSearch extends MultiAStar{
	constructor(options){
		super(options);

		let heuristicToOverride = this.heuristic;

		this.heuristic = (node1, node2) => {
			return heuristicToOverride(node1, node2, 500000);
		};
	}
}
