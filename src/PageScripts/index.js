import singleEndPointPageInitFunction from './SingleEndPoint/main';
import multiEndPointsPageInitFunction from './MultiEndPoints/main';
import '@babel/polyfill';

const single = {
	init: singleEndPointPageInitFunction
};

const multi = {
	init: multiEndPointsPageInitFunction
};

export {
	single,
	multi
};
