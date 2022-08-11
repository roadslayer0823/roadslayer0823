var candyGame = candyGame || {};

candyGame.preloadState = {
    preload: function(){
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loader');
        this.loaderBar.scale.setTo(100, 1);
        this.load.setPreloadSprite(this.loaderBar);

        this.load.image('backyard','image/backyard2.png');
        this.load.image('bean1', 'image/bean_blue.png');
        this.load.image('bean2', 'image/bean_red.png');
        this.load.image('bean3', 'image/bean_green.png');
        this.load.image('bean4', 'image/bean_orange.png');
        this.load.image('bean5', 'image/bean_pink.png');
        this.load.image('bean6', 'image/bean_purple.png');
        this.load.image('bean7', 'image/bean_white.png');
        this.load.image('bean8', 'image/bean_yellow.png');
        this.load.image('deadBean', 'image/bean_dead.png');
    },

    create: function(){
        this.state.start('gameState');
    }
};