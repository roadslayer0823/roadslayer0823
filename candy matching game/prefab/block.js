var candyGame = candyGame || {};

candyGame.Block = function(state, x, y, data){
    Phaser.Sprite.call(this, state.game, x, y, data.source);

    this.game = state.game;
    this.state = state;
    this.row = data.row;
    this.col = data.col;
};

candyGame.Block.prototype = Object.create(Phaser.Sprite.prototype);
candyGame.Block.prototype.constructor = candyGame.Block;

candyGame.Block.prototype.reset = function(x, y, data){
    Phaser.Sprite.prototype.reset.call(this, x, y);
    this.loadTexture(data.source);
    
    this.row = data.row;
    this.col = data.col;
};

//when the block is a chain kill the sprite
candyGame.Block.prototype.kill = function(){
    this.loadTexture('deadBean');
    this.col = null;
    this.row = null;

    this.game.time.events.add(this.state.animationTime/2, function(){
        Phaser.Sprite.prototype.kill.call(this);
    }, this);
}