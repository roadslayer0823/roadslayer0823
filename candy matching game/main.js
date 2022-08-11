var candyGame = candyGame || {};

candyGame.game = new Phaser.Game(700, 1080, Phaser.AUTO);

candyGame.game.state.add('gameState', candyGame.gameState);
candyGame.game.state.add('boot', candyGame.bootState);
candyGame.game.state.add('preload', candyGame.preloadState);

candyGame.game.state.start('boot');