class Heuristics{
    constructor(){
    }
    Manhattan(Node,EndPoint){
        h=Math.abs(Node.x-EndPoint.x)+Math.abs(Node.y-EndPoint.y);
        return h;
    }

    Chebyshev(Node,EndPoint){
        h=Math.max(Math.abs(Node.x-EndPoint.x),Math.abs(Node.y-EndPoint.y));
        return h;
    }

    Euclidean(Node,EndPoint){
        h=Math.sqrt(Math.pow(Node.x-EndPoint.x,2)+Math.pow(Node.y-EndPoint.y,2));
        return h;
    }
    Octile(Node,EndPoint){
        h=Math.max(Math.abs(Node.x-EndPoint.x),Math.abs(Node.y-EndPoint.y))+(Math.sqrt(2)-1)*(Math.min(Math.abs(Node.x-EndPoint.x),Math.abs(Node.y-EndPoint.y)));
        return h;
    }
}
module.exports=Heuristics;
