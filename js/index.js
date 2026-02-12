(function () {
  const setupGame = () => {
    const config = {
      type: Phaser.AUTO,
      width: cw,
      height: ch,
      backgroundColor: '#314157',
      parent: 'app',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1500 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [
        gameStart,
        gamePlay,
      ]
    }

    const game = new Phaser.Game(config);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGame);
  } else {
    setupGame();
  }
})();
