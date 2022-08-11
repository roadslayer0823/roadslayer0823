var candyGame = candyGame || {};

candyGame.gameState = {
    init: function(){
        this.numberRow = 10;
        this.numberCol = 10;
        this.numberVariation = 6;
        this.blockSize = 50;
        this.animationTime = 150;
    },

    create: function(){
        //background
        this.background = this.add.sprite(0, 0, 'backyard');
        this.background.scale.setTo(2);

        //block
        this.block = this.add.group();
        this.block.enableBody = true;
        
        //board outfit
        this.board = new candyGame.Board(this, this.numberRow, this.numberCol, this.numberVariation);
        this.board.consoleLog();

        this.createBoard();

        var block1 = this.block.children[10];
        var block2 = this.block.children[11];

        this.swapingBlock(block1, block2);
    },

    //creating a block sprite on the board
    createBlock: function(x, y, data){
        var blocks = this.block.getFirstExists(false);

        if(!blocks){
            blocks = new candyGame.Block(this, x, y, data);
            this.block.add(blocks);
        }
        else{
            blocks.reset(x, y, data);
        }

        return blocks;
    },

    //use for creating a board UI on the screen
    createBoard: function(){
        var i, j, block, square, x, y, data;

        //semi-transparent square
        var squareBitmap = this.add.bitmapData(this.blockSize + 10, this.blockSize + 10);
        squareBitmap.ctx.fillStyle = '#0000FF';
        squareBitmap.ctx.fillRect(4, 4, this.blockSize + 10, this.blockSize + 10);

        //iteration
        for(i = 0; i < this.numberRow; i++){
            for(j = 0; j < this.numberCol; j++){
                x = 50 + j * (this.blockSize + 10);
                y = 150 + i * (this.blockSize + 10);

                square = this.add.sprite(x, y, squareBitmap);
                square.alpha = 0.2;

                this.createBlock(x+15, y+15, {source: 'bean' + this.board.grid[i][j], row: i, col: j});
            }
        }

        this.game.world.bringToTop(this.block);
    },

    //getting the data of the block from the row and column
    getBlockFromColRow: function(position){
        var foundBlock;

        this.block.forEachAlive(function(blocks){
            if(blocks.row === position.row && blocks.col === position.col){
                foundBlock = blocks;
            }
        }, this);

        return foundBlock;
    },

    //creating drop block animation
    dropBlockAni: function(sourceRow, targetRow, col){
        var block = this.getBlockFromColRow({row: sourceRow, col: col});
        var targetY = 150 + targetRow * (this.blockSize + 10);

        block.row = targetRow;

        var blockAnimation = this.game.add.tween(block);
        blockAnimation.to({y: targetY+15}, this.animationTime);
        blockAnimation.start();
        
    },

    //creating drop reserve block animation
    dropReserveBlockAni: function(sourceRow, targetRow, col){
        var x = 50 + col *(this.blockSize + 10);
        var y = -(this.blockSize + 10) *  this.board.reserveRow + sourceRow * (this.blockSize + 10);
        
        var block = this.createBlock(x, y, {source: 'bean' + this.board.grid[targetRow][col], row: targetRow, col: col});
        var targetY = 150 + targetRow * (this.blockSize + 10);

        var blockAnimation = this.game.add.tween(block);
        blockAnimation.to({x: x+15, y: targetY+15}, this.animationTime);
        blockAnimation.start();
    },

    //allow the block can been swaping
    swapingBlock: function(block1, block2){
        var block1Movement = this.game.add.tween(block1);
        block1Movement.to({x: block2.x, y: block2.y}, this.animationTime);
        block1Movement.onComplete.add(function(){
            //after the animation update board
            this.board.swap(block1, block2);

            if(!this.reversingSwap){
                var chain=this.board.findAllChain();

                if(chain.length > 0){
                    this.board.clearChain();
                    this.board.updateBlock();
                }
                else{
                    this.reversingSwap = true;
                    this.swapingBlock(block1, block2);
                }
            }
            else{
                this.reversingSwap = false;
            }
        }, this);
        block1Movement.start();

        var block2Movement = this.game.add.tween(block2);
        block2Movement.to({x: block1.x, y: block1.y}, this.animationTime);
        block2Movement.start();
    }
};