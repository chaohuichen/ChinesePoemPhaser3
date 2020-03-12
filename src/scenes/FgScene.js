import Player from '../entity/Player';
import Ground from '../entity/Ground';
import 'phaser';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.collectStar = this.collectStar.bind(this);
    this.hitBomb = this.hitBomb.bind(this);
    this.score = 0;
    this.scoreText = '';
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    //player
    this.load.spritesheet('dude', 'assets/spriteSheets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    //the ground sprites
    this.load.image('platform', 'assets/sprites/platform.png');

    //star img
    this.load.image('star', 'assets/sprites/star.png');

    //bomb img
    this.load.image('bomb', 'assets/sprites/bomb.png');
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });

    //the score text
    this.scoreText = this.add.text(16, 16, 'score:0', {
      fontSize: '32px',
      fill: '#000'
    });
    // the lower ground
    this.groundGroup
      .create(400, 568, 'platform')
      .setScale(2)
      .refreshBody();
    this.createGround(600, 400);
    this.createGround(50, 250);
    this.createGround(750, 220);

    //player create
    this.dude = new Player(this, 200, 400, 'dude').setScale(1);
    this.dude.setBounce(0.2);
    this.dude.setCollideWorldBounds(true);
    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createStarGroup();
    this.createBombGroup();
    // Create sounds
    // << CREATE SOUNDS HERE >>
    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.collider(this.dude, this.groundGroup);
    this.physics.add.collider(this.stars, this.groundGroup);
    this.physics.add.collider(this.bombs, this.groundGroup);

    this.physics.add.collider(this.dude, this.bombs, this.hitBomb, null, this);
    //overlap
    this.physics.add.overlap(
      this.dude,
      this.stars,
      this.collectStar,
      null,
      this
    );
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score:' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(child => {
        child.enableBody(true, child.x, 0, true, true);
      });

      let x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      this.bomb = this.bombs.create(x, 16, 'bomb');
      this.bomb.setBounce(1);
      this.bomb.setCollideWorldBounds(true);
      this.bomb.setVelocity(Phaser.Math.Between((-200, 200), 20));
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;
  }
  createGround(x, y) {
    this.groundGroup.create(x, y, 'platform');
  }

  createBombGroup() {
    this.bombs = this.physics.add.group();
  }
  createStarGroup() {
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  }
  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'stand',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 10
    });
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'dude', frame: 6 }],
      frameRate: 20
    });
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.dude.update(this.cursors);
  }
}
