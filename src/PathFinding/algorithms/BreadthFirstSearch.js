class BreadthFirstSearch{
    constructor(){

    }
    finder(grid){
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
                if (neighbours[i].endpoint==true){
                    let path=Utility.Path(neighbours[i]);
                    return path;
                    }
                neighbours[i].visited=true;
                OpenList.append(neighbours[i]);
                        }
            current_Node.visited=true;
            }
        }  
    } 
module.exports=BreadthFirstSearch;
