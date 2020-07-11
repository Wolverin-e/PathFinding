import AStar from './AStar';

export default class Dijkshtra extends AStar{
	constructor(options){
		super(options);

		this.heuristic = () => {
			return 0;
		};
	}
}
