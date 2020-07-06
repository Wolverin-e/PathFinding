const Heuristics=require('../core/Heurastic.js');
const Utility= require('../core/Utility.js');

class Astar{
    constructor(){
            this.G=true;
    }
    NoGvalueUsed(){
        this.G=false;
    }
    finder(grid,given_heuristics){
        
        let OpenList=[];

        grid.startpoint.startpoint=true;
        grid.endpoint.endpoint=true;
        OpenList.append(grid.startpoint);

        while (OpenList.length!==0){
            let current_Node=OpenList.shift();
            let neighbours=grid.neighbours(current_Node,DiagonalMovement,CrossCorner);
            for (let i=0;i<neighbours.length;i++){
                if (neighbours[i].visited==true){
                    continue;
                }
                neighbours[i].parent=current_Node;
                if (i<4){
                    var dist=1;
                    }
                else{
                    var dist=1.414;
                }
                if (this.G==false){
                    neighbours[i].g=0;
                }
                else{
                    neighbours[i].g=neighbours[i].parent.g+dist;}
                if (given_heuristics==' Manhattan'){
                    neighbours[i].h=Heuristics.Manhattan(neighbours[i],grid.endpoint);
                }
                else if(given_heuristics=='NoHeuristics'){
                    neighbours[i].h=0;
                }
                else if(given_heuristics=='Chebyshev'){
                    neighbours[i].h=Heuristics.Chebyshev(neighbours[i],grid.endpoint);
                }
                else if(given_heuristics=='Octile'){
                    neighbours[i].h=Heuristics.Octile(neighbours[i],grid.endpoint);
                }
                else{
                    neighbours[i].h=Heuristics.Euclidean(neighbours[i],grid.endpoint);
                }
                neighbours[i].f=neighbours[i].g+neighbours[i].h;
                if (neighbours[i].endpoint==true){
                        let path=Utility.Path(neighbours[i]);
                        return path;
                        }
                OpenList.append(neighbours[i]);
                }
                current_Node.visited=true;
                OpenList.sort(function(a,b){
                return a.f-b.f;});
        }
    }
}
module.exports=Astar;
