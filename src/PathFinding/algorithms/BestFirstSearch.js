const Astar=require('./A.js');
class BestFirstSearch{
    constructor(){

    }
    finder(grid,given_heuristics){
        Astar.NoGvalueUsed();
        let path=Astar.finder(grid,given_heuristics);
        return path;
    }
}
module.exports=BestFirstSearch;