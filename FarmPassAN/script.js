
let gameScene = new Phaser.Scene('Farm Pass');
// game's configuration

let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render game (WebGL or Canvas)
  width: 704 * 1.3, // game width
  height: 320 * 1.3, // game height
  scene: gameScene // newly created scene
   
};

gameScene.init = function() {
  this.playerSpeed = 1.5;
  this.enemyMaxY = 390;
  this.enemyMinY = 30;
}

gameScene.preload = function() {
  // load images
  this.load.image('background', 'game1/grass.png');
  this.load.image('cow', 'game1/cow_walk1.png');
  this.load.image('pig', 'game1/pig_walk1.png');
  this.load.image('sheep', 'game1/sheep_walk1.png');
  /*
  this.load.spritesheet('cow', 'game1/cow_walk.png', { frameWidth: 30, frameHeight: 75 });
  this.load.spritesheet('pig', 'game1/pig_walk.png', { frameWidth: 125, frameHeight: 125 });
  this.load.spritesheet('sheep', 'game1/sheep_walk.png', { frameWidth: 125, frameHeight: 125 });
  */
  this.load.spritesheet('player', 'game1/chicken_walk.png', { frameWidth: 32, frameHeight: 30 });
  this.load.image('treasure', 'assets/treasure.png');
};
// executed once, after assets were loaded
gameScene.create = function() {
  // background
  let bg = this.add.sprite(0, 0, 'background').setScale(1.3);
  bg.setOrigin(0, 0);

  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player').setScale(1.3);

  // group of enemies
  this.cow = this.add.group({
    key: 'cow',
    repeat: 1,
    setXY: {
      x: 110,
      y: 50,
      stepX: 100,
      stepY: 40
    }
  });
  // group of enemies
  this.pig = this.add.group({
    key: 'pig',
    repeat: 2,
    setXY: {
      x: 290,
      y: 160,
      stepX: 100,
      stepY: 40
    }
  });
  this.sheep = this.add.group({
    key: 'sheep',
    repeat: 1,
    setXY: {
      x: 530,
      y: 200,
      stepX: 80,
      stepY: 40
    }
  });

  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.6);

  let cow = this.cow.getChildren();
  this.enemyVel(cow);

  let pig = this.pig.getChildren();
  this.enemyVel(pig);

  let sheep = this.sheep.getChildren();
  this.enemyVel(sheep);


  this.anims.create({
    key: 'move',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
    frameRate: 10,
    repeat: -1
  });

  this.isPlayerAlive = true;

  this.cameras.main.resetFX();

}

gameScene.update = function() {
  //only process function if player is alive (condition)
  if (!this.isPlayerAlive) {
    return;
  }
  // check for active input
  if (this.input.activePointer.isDown) { //user interaction
    // player walks
    
    this.player.x += this.playerSpeed;
    this.player.anims.play('move', true);
  } else {
    this.player.anims.play('idle', true);
  }

  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.gameOver();
  }


  let cow = this.cow.getChildren();
  this.bounceEnemy(cow);
  this.collideEnemy(cow);

  let pig = this.pig.getChildren();
  this.bounceEnemy(pig);
  this.collideEnemy(pig);

  let sheep = this.sheep.getChildren();
  this.bounceEnemy(sheep);
  this.collideEnemy(sheep);



};

gameScene.bounceEnemy = function(enemies) {
  // enemy movement
  /*
  -Enemies have a speed, a maximum and a minimum vale of Y they will reach (we already have all of this declared in init).
  -We want to increase the position of an enemy until it reaches the maximum value
  -Then, we want to reverse the movement, until the minimum value is reached
  -When the minimum value is reached, go back up.
  */

  let numEnemies = enemies.length;
  for (let i = 0; i < numEnemies; i++) {
    // move enemies
    enemies[i].y += enemies[i].speed;
    // reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }
  }

}

gameScene.collideEnemy = function(enemies) {
  // enemy movement and collision

  let numEnemies = enemies.length;
  for (let i = 0; i < numEnemies; i++) {
    // move enemies
    enemies[i].y += enemies[i].speed;
    // reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }
    // enemy collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }

}

gameScene.enemyVel = function(enemies) {
  // restart the scene
  let en = enemies;

  Phaser.Actions.Call(en, function(enemy) {
    enemy.speed = Math.random() * 1 + 1;
  }, this);
}

gameScene.gameOver = function() {
  // flag to set player is dead
  // flag to set player is dead
  this.isPlayerAlive = false;
  // shake the camera
  this.cameras.main.shake(500);
  // fade camera
  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);
  // restart game
  this.time.delayedCall(500, function() {
    this.scene.start('Farm Pass')
  }, [], this);


};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);

window.onload = function() {
    new BelowGameImage('assets/apCert.jpeg', 'image-container', 500, 300);
}; // my own class that adds image to bottom of pag