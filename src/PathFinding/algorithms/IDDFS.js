import IDAStar from './IDAStar';

export default class IDDFS extends IDAStar{
	constructor(options){
		super(options);

		this.heuristic = () => 0;
	}
}
