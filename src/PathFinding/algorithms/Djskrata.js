const Astar=require('./A.js');
class Dijkstra{
    constructor(){

    }
    finder(grid){
        let path=Astar.finder(grid,'NoHeuristics');
        return path;
    }
}
module.exports=Dijkstra;