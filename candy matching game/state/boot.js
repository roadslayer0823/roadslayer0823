var candyGame = candyGame || {};

candyGame.bootState = {
    init: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAllAlignHorizontally = true;
        this.scale.pageAllAlignVertically = true;
    },

    preload: function(){
        this.load.image('loader', 'image/preloader-bar.png');
    },

    create: function(){
        this.state.start('preload');
    }
};