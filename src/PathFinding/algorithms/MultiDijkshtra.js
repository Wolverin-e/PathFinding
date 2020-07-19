import MultiAStar from './MultiAStar';

export default class MultiDijkshtra extends MultiAStar{
	constructor(options){
		super(options);

		this.heuristic = () => {
			return 0;
		};
	}
}
