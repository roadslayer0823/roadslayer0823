var candyGame = candyGame || {};

candyGame.Board = function(state, row, col, blockVariation){
    this.state = state;
    this.row = row;
    this.col = col;
    this.blockVariation = blockVariation;

    //main grid(mean the square on the net)
    this.grid = [];

    var i, j;
    for(i = 0; i < row; i++){
        this.grid.push([]);

        for(j = 0; j < col; j++){
            this.grid[i].push(0);
        }
    }

    //when the new blocks is needed the reserve grid will be on the top
    this.reserveGrid = [];

    this.reserveRow = row;

    for(i = 0; i < this.reserveRow; i++){
        this.reserveGrid.push([]);

        for(j = 0; j < col; j++){
            this.reserveGrid[i].push(0);
        }
    }

    //fill the grid
    this.fillGrid();
    this.fillReserveGrid();
    
};

//fill in the value(block) on the main grid with using math.random()
candyGame.Board.prototype.fillGrid = function(){
    var i, j, variation;
    for(i = 0; i < this.row; i++){
        for(j = 0; j < this.col; j++){
            variation = Math.floor(Math.random() * this.blockVariation) + 1;
            this.grid[i][j] = variation;
        }
    }

    //if there is has any chain, refill the block
    var chain = this.findAllChain();
    if(chain.length>0){
        this.fillGrid();
    }
};



//filling the reserver grid is been drop through the main grid
candyGame.Board.prototype.fillReserveGrid = function(){
    var i, j, variation;
    for(i = 0; i < this.reserveRow; i++){
        for(j = 0; j < this.col; j++){
            variation = Math.floor(Math.random() * this.blockVariation) + 1;
            this.reserveGrid[i][j] = variation;
        }
    }
};

//presenting the number of the row and column
candyGame.Board.prototype.consoleLog = function(){
    var i, j;
    var printString = '';

    for(i = 0; i < this.reserveRow; i++){
        printString += '\n';
        for(j = 0; j < this.col; j++){
           printString += ' ' + this.reserveGrid[i][j];
        }
    }

    printString += '\n';

    for(j = 0; j<this.col; j++){
        printString += ' -';
    }

    for(i = 0; i < this.row; i++){
        printString += '\n';
        for(j = 0; j < this.col; j++){
            printString += ' ' + this.grid[i][j];
        }
    }

    console.log(printString);
};

//swapping block function
candyGame.Board.prototype.swap = function(source, target){
    var temperal = this.grid[target.row][target.col];
    this.grid[target.row][target.col] = this.grid[source.row][source.col];
    this.grid[source.row][source.col] = temperal;
};

//checking the object is able to be swap or not
candyGame.Board.prototype.checkAdjacent = function(source, target){
    var diffRow = Math.abs(source.row - target.row);
    var diffCol = Math.abs(source.col - target.col);

    var adjacent = (diffRow == 1 && diffCol === 0) || (diffRow == 0 && diffCol === 1);
    return adjacent;
}

//checking which single block has a chain with another block
candyGame.Board.prototype.checkChain = function(block){
    var chained = false;
    var variation = this.grid[block.row][block.col];
    var row = block.row;
    var col = block.col;

    //left chain
    if(variation == this.grid[row][col - 1] && variation == this.grid[row][col - 2]){
       chained = true; 
    }

    //right chain
    if(variation == this.grid[row][col + 1] && variation == this.grid[row][col + 2]){
        chained = true;
    }

    //top chain
    if(this.grid[row-2]){
        if(variation == this.grid[row - 1][col] && variation == this.grid[row - 2][col]){
            chained = true;
        }
    }

    //bottom chain
    if(this.grid[row + 2]){
    if(variation == this.grid[row + 1][col] && variation == this.grid[row + 2][col]){
        chained = true;
        }
    }

    //center - horizontal
    if(variation == this.grid[row][col - 1] && variation == this.grid[row][col + 1]){
        chained = true;
    }

    //center - vertical
    if(this.grid[row-1] && this.grid[row+1]){
    if(variation == this.grid[row -1][col] && variation == this.grid[row + 1][col]){
        chained = true;
        }
    }

    return chained;
};

//use to find all the chain
candyGame.Board.prototype.findAllChain = function(){
    var chained = [];
    var i, j;

    for(i = 0; i < this.row; i++){
        for(j = 0; j < this.col; j++){
           if(this.checkChain({row: i, col: j})){
                chained.push({row: i, col: j});
           }
        }
    }

    return chained;
};

//clear all the chained
candyGame.Board.prototype.clearChain = function(){
    //get all the block need to be clear
    var chainedBlock = this.findAllChain();

    //set the chain to zero
    chainedBlock.forEach(function(blocks){
        this.grid[blocks.row][blocks.col] = 0;

        //kill the block
        this.state.getBlockFromColRow(blocks).kill();
    }, this);
};

//drop a block in the main grid from a position to another
//the source set it to zero
candyGame.Board.prototype.dropBlock = function(sourceRow, targetRow, col){
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;

    this.state.dropBlockAni(sourceRow, targetRow, col);
};

//drop a block from the reserve grid from a position to another
//the source set to zero
candyGame.Board.prototype.dropReserveBlock = function(sourceRow, targetRow, col){
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;

    this.state.dropReserveBlockAni(sourceRow, targetRow, col);
};

//move down the block to fill in empty slots
candyGame.Board.prototype.updateBlock = function(){
    var i, j, k, foundBlock;

    //go through all the row from the bottom to up
    for(i = this.row - 1; i >= 0; i--){
        for(j = 0; j<this.col; j++){
            //if the block is zero, then climb up to get non-zero block
            if(this.grid[i][j] === 0){
                foundBlock = false;

                //climbing up in the main grid
                for(k = i - 1; k >=0; k--){
                    if(this.grid[k][j] > 0){
                        this.dropBlock(k, i, j);
                        foundBlock = true;
                        break;
                    }
                }

                if(!foundBlock){
                    //climb up in the reserve grid
                    for(k = this.reserveRow - 1; k >=0; k--){
                        if(this.reserveGrid[k][j] > 0){
                            this.dropReserveBlock(k, i, j);
                            break;
                        }
                    }
                }
            }
        }
    }

    this.fillReserveGrid();
};