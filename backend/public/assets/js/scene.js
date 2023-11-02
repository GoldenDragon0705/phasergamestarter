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

  const { me, opposite, roomId } = data;

  function init() {

  }

  function preload() {
    this.load.image('x', 'assets/imgs/x.png');
    this.load.image('y', 'assets/imgs/y.png');
  }

  function create() {
    this.add.image(200, 300, 'x').setDisplaySize(100, 100);
    this.add.image(500, 300, 'y').setDisplaySize(100, 100);
    let QuitButton = this.add.text(700, 550, "Quit", { font: '20px' }).setInteractive().on('pointerdown', (pointer) => {
      socket.emit(SOCKET_PROC.QUIT)
    });

    let roomNum = this.add.text(350, 100, '', { font: '30px', fill: '#fff' });
    roomNum.text = "roomNumber" + roomId;

    let meNameText = this.add.text(200, 400, '', { font: '30px', fill: '#fff' });
    let oppositeNameText = this.add.text(500, 400, '', { font: '30px', fill: '#fff' });

    let meName = me.username;
    let oppositeName = opposite.username;
    meNameText.text = meName;
    oppositeNameText.text = oppositeName;

  }
} 