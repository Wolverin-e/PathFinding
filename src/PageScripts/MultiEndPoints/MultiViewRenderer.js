import ViewRenderer from '../SingleEndPoint/ViewRenderer';

class MultiViewRenderer extends ViewRenderer{
	constructor(options){
		super(options);
	}

	addEndPoint(x, y){
		this.getTDElemAtXY(x, y).addClass("endPoint");
	}

	shiftEndPoint(from, to){
		this.getTDElemAtXY(from.x, from.y).removeClass("endPoint");
		this.getTDElemAtXY(to.x, to.y).addClass("endPoint");
	}
}

export default MultiViewRenderer;
