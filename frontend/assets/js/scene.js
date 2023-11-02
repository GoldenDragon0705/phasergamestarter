const createGame = (data) => {

  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    scene: {
      preload: preload,
      create: create
    }
  }

  var game = new Phaser.Game(config);

  const preload = () => {
    this.load.image('x', 'assets/imgs/x.png');
  }

  const create = () => {
    this.add.image(400, 300, 'x');
    
  }
} 