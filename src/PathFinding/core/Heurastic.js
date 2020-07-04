class Heuristics{
    constructor(){
    }
    Manhattan(Node,EndPoint){
        h=Math.abs(Node.x-EndPoint.x)+Math.abs(Node.y-EndPoint.y);
        return h;
    }

    Digonal(Node,EndPoint){
        h=Math.max(Math.abs(Node.x-EndPoint.x),Math.abs(Node.y-EndPoint.y));
        return h;
    }

    Euclidean(Node,EndPoint){
        h=Math.sqrt(Math.pow(Node.x-EndPoint.x,2)+Math.pow(Node.y-EndPoint.y,2));
        return h;
    }
}