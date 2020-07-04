const Heuristics=require('../core/Heurastic.js');

class Astar{
    constructor(){
            
    }
    Path(Node){
        let path=[];
        while (Node.parent.startpoint==false){
                path.append(Node);
                Node=Node.parent;
        }
        path1=[];
        for (let i=Math.length(path)-1;i>-1;i--){
            path1.append(path[i]);
        }
        return path1;

    }

    finder(grid,given_heuristics){
        let Heuristics=new Heuristics();
        let OpenList=[];
        let ClosedList=[];
        let minGoalf=9999999999;

        grid.startpoint.startpoint=true;
        grid.endpoint.endpoint=true;
        OpenList.append(grid.startpoint);

        while (OpenList.length!==0){
            let current_Node=OpenList.shift();
            let neighbours=grid.neighbours(current_Node,DiagonalMovement,CrossCorner);
            for (let i=0;i<neighbours.length;i++){
                neighbours[i].parent=current_Node;
                if (i<4){
                    let dist=1;
                    }
                else{
                    let dist=1.414;
                }
                neighbours[i].g=neighbours[i].parent.g+dist;
                if (given_heuristics==' Manhattan'){
                    neighbours[i].h=Heuristics.Manhattan(neighbours[i],grid.endpoint);
                }
                else if(given_heuristics=='Digonal'){
                    neighbours[i].h=Heuristics.Digonal(neighbours[i],grid.endpoint);
                }
                else{
                    neighbours[i].h=Heuristics.Euclidean(neighbours[i],grid.endpoint);
                }
                neighbours[i].f=neighbours[i].g+neighbours[i].h;
                if (neighbours[i].endpoint==true){
                    if (minGoalf>neighbours[i].f){
                        minGoalf=neighbours[i].f
                        if (minGoalf<=OpenList[0].f){
                            let path=this.Path(neighbours[i]);
                            return path;
                        }
                    }
                }
                OpenList.append(neighbours[i]);
                }
            ClosedList.append(current_Node);
            OpenList.sort(function(a,b){
                return a.f-b.f;
            });

        }
    }
}
