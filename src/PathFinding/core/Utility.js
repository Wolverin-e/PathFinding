class Utility{
    constructor(){

    }
    Path(Node){
        let path=[];
        while (Node.parent.startpoint==false){
                path.append(Node);
                Node=Node.parent;
        }
        path=path.reverse();
        return path;
    }

    BiderctionalPath(Node1,Node2){
        let path1=this.Path(Node1);
        let path2=this.Path(Node2);
        let path=path1.concate(path2.reverse());
        return path;
    }
}
module.exports=Utility;