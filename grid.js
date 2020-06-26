class Grid{
    constructor(i, j){
        this.matrix = [];
        for(let i=1; i<100; i++){
            this.matrix[i] = []
            for(let j=1; j<100; j++){
                this.matrix[i][j] = 0;
            }
        }
    }

    changeIntensity(i, j){
        this.matrix[i][j] = 1;
    }
}

module.exports = Grid;