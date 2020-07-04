class Node{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.obstacle=false;
        this.visited=false;
        this.f=0;
        this.g=0;
        this.h=0;
        this.parent=this;
        this.startpoint=false;
        this.endpoint=false;
    }
    makeObstacle(){
        this.obstacle=true;
    }
    makeVisited(){
        this.visited=true;
    }
    removeObstacle(){
        this.obstacle=false;
    }
    makeUnvisited(){
        this.visited=false;
    }
}

module.exports=Node;