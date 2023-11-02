const createGame = (data) => {

  var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    scene: {
      init: init,
      preload: preload,
      create: create,
    }
  }

  var game = new Phaser.Game(config);

  function init() {

  }

  function preload() {
    this.load.image('x', 'assets/imgs/x.png');
  }

  function create() {
    this.add.image(400, 300, 'x');

  }
} 