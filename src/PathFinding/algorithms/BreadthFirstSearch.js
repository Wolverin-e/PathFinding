export default class BreadthFirstSearch{
	constructor(opts){
		console.log(opts);
	}

	findPath(grid){
		let uLimit = 10;
		let dLimit = 20;
		let lLimit = 10;
		let rLimit = 20;

		for(let y=uLimit; y<dLimit; y++){
			for(let x=lLimit; x<rLimit; x++){
				grid[y][x].visited = true;
			}
		}

		return [
			{x: 12, y: 12}, 
			{x: 3, y: 3}, 
			{x: 4, y: 4}, 
			{x: 5, y: 5}, 
			{x: 6, y: 6}, 
		];
	}
}
