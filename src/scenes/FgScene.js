import Player from '../entity/Player';
import Ground from '../entity/Ground';
import Star from '../entity/Star';
import 'phaser';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.collectStar = this.collectStar.bind(this);
    this.hitBomb = this.hitBomb.bind(this);
    this.score = 0;
    this.scoreText = '';
    this.CharText = '';
    this.bombNum = 1;
    this.starNum = 1;
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

    this.load.image('floor2', 'assets/sprites/floors/floor2.png');
    this.load.image('floor3', 'assets/sprites/floors/floor3.png');
    this.load.image('floor1', 'assets/sprites/floors/1.png');
    this.load.image('floor13', 'assets/sprites/floors/13.png');
    this.load.image('floor14', 'assets/sprites/floors/14.png');
    this.load.image('floor15', 'assets/sprites/floors/15.png');

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

    this.createPlatform();
    //the score text
    // this.scoreText = this.add.text(16, 16, 'score:0', {
    //   fontSize: '32px',
    //   fill: '#000'
    // });

    this.CharText = this.add.text(50, 50, '我爱你', {
      fontSize: '32px',
      fill: '#000'
    });

    //player create
    this.dude = new Player(this, 30, 400, 'dude').setScale(1);
    this.dude.setBounce(0.2);
    this.dude.setCollideWorldBounds(true);
    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.createStarGroup();
    this.createBombGroup();
    this.createTest();
    // Create sounds
    // << CREATE SOUNDS HERE >>
    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.collider(this.dude, this.testGroup);
    this.physics.add.collider(this.stars, this.testGroup);
    this.physics.add.collider(this.bombs, this.testGroup);

    this.physics.add.collider(this.dude, this.bombs, this.hitBomb, null, this);
    //overlap
    this.physics.add.overlap(
      this.dude,
      this.stars,
      this.collectStar,
      null,
      this
    );
    this.physics.add.overlap(
      this.dude,
      this.startest,
      this.collectStar,
      null,
      this
    );
  }

  createPlatform() {
    this.testGroup = this.physics.add.staticGroup({ classType: Ground });
    this.testGroup.create(50, 650, 'floor2');
    this.testGroup.create(175, 650, 'floor3');

    this.testGroup.create(400, 650, 'floor1');
    this.testGroup.create(525, 650, 'floor2');
    this.testGroup.create(650, 650, 'floor3');

    this.testGroup.create(900, 650, 'floor1');
    this.testGroup.create(940, 650, 'floor2');

    this.testGroup.create(450, 450, 'floor13');
    this.testGroup.create(575, 450, 'floor14');
    this.testGroup.create(700, 450, 'floor15');

    this.testGroup.create(50, 350, 'floor14');
    this.testGroup.create(175, 350, 'floor15');

    this.testGroup.create(350, 150, 'floor14');

    this.testGroup.create(750, 250, 'floor13');
    this.testGroup.create(875, 250, 'floor14');
    this.testGroup.create(1000, 250, 'floor15');
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

      this.bomb = this.bombs.create(x, this.bombNum, 'bomb');
      this.bomb.setBounce(1);
      this.bomb.setCollideWorldBounds(true);
      this.bomb.setVelocity(Phaser.Math.Between((-200, 200), 20));

      this.bombNum += 1;
      this.star = this.startest.create(x, 16, 'star');
      this.star.setBounce(1);
      this.star.setCollideWorldBounds(true);
      this.star.setVelocity(Phaser.Math.Between((-200, 200), 20));
    }
  }
  createTest() {
    this.startest = this.physics.add.group();
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
      repeat: 2,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(child => {
      child.setBounce(1);
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
