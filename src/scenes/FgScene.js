import Player from '../entity/Player';
import Ground from '../entity/Ground';
import Star from '../entity/Star';
import Phaser from 'phaser';

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.collectStar = this.collectStar.bind(this);
    this.restart = this.restart.bind(this);
    this.hitBomb = this.hitBomb.bind(this);
    this.createStarGroup = this.createStarGroup.bind(this);
    this.collectword = this.collectword.bind(this);
    this.score = 0;
    this.scoreText = [];
    this.pinyin = [];
    this.bombNum = 1;
    this.starNum = 1;
    this.gameOver = false;
    this.height = 1000;
    this.width = 700;
    this.size = 1;
    this.limit = 10;

    this.arrayWord = [
      'bed',
      'front',
      'bright',
      'moon',
      'light',
      'suspect',
      'is',
      'ground',
      'on',
      'frost',
      'raise',
      'head',
      'gaze',
      'bright',
      'moon',
      'lower',
      'head',
      'think',
      'home',
      'town'
    ];
    this.count = 0;
    this.loadPhase1 = this.loadPhase1.bind(this);
    this.loadPhase2 = this.loadPhase2.bind(this);
    this.loadPhase3 = this.loadPhase3.bind(this);
    this.loadPhase4 = this.loadPhase4.bind(this);
    this.createpinyin2 = this.createpinyin2.bind(this);
    this.createWord = this.createWord.bind(this);
    this.colliderGroup = this.colliderGroup.bind(this);
    this.createTextGroup = this.createTextGroup.bind(this);
    this.createOverlapGround = this.createOverlapGround.bind(this);
    this.displayPhase = this.displayPhase.bind(this);
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
    this.loadPhase1();
    // Preload Sounds
    // << LOAD SOUNDS HERE >>

    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('bedChinese', 'assets/audio/bed.wav');
    this.load.audio('me', 'assets/audio/me.wav');
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    this.createPlatform();
    //the score text

    this.createTextGroup();
    //player create
    this.dude = new Player(this, 30, 400, 'dude').setScale(this.size);

    this.createAnimations();

    //user keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    //gameover text

    this.gameOverText = this.add.text(400, 300, 'Game Over', {
      fontSize: 'bold 64px',
      fill: '#000'
    });
    this.gameOverText.setOrigin(0.1);
    this.gameOverText.visible = false;

    //chinese word
    this.createWord();

    this.createBombGroup();
    this.createTest();
    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.jumpSound = this.sound.add('jump');
    this.meSound = this.sound.add('me');
    this.bedSound = this.sound.add('bedChinese');
    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.collider(this.dude, this.testGroup);
    this.colliderGroup();
    // this.physics.add.collider(this.stars, this.testGroup);
    this.physics.add.collider(this.bombs, this.testGroup);
    // this.physics.add.collider(this.startest, this.testGroup);
    this.physics.add.collider(this.dude, this.bombs, this.hitBomb, null, this);
    //overlap
    // this.physics.add.overlap(
    //   this.dude,
    //   this.stars,
    //   this.collectStar,
    //   null,
    //   this
    // );
    this.createOverlapGround();
  }
  createOverlapGround() {
    this.arrayWord.forEach(word => {
      this.physics.add.overlap(
        this.dude,
        this[`${word}`],
        this.collectword,
        null,
        this
      );
    });
  }

  createTextGroup() {
    let phase = [
      '床',
      '前',
      '明',
      '月',
      '光',
      '疑',
      '是',
      '地',
      '上',
      '霜',
      '舉',
      '頭',
      '望',
      '明',
      '月',
      '低',
      '頭',
      '思',
      '故',
      '鄉'
    ];
    let start = 16;
    let space = 32;
    for (let i = 0; i < phase.length; ++i) {
      this.scoreText[i] = this.add.text(start, 16, phase[i], {
        fontSize: '32px',
        fill: '#000',
        fontFamily: 'Times New Roman'
      });
      if ((phase.length - i - 1) % 5 === 0) {
        start += space + 40;
      } else {
        start += space + 10;
      }
    }

    this.pinyin[0] = this.add.text(0, 48, 'Chuáng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[1] = this.add.text(60, 48, 'Qián', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[2] = this.add.text(100, 48, 'Míng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[3] = this.add.text(145, 48, 'Yuè', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[4] = this.add.text(180, 48, 'Guāng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });

    this.pinyin[5] = this.add.text(260, 48, 'Yí', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[6] = this.add.text(300, 48, 'Shì', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[7] = this.add.text(345, 48, 'Dī', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[8] = this.add.text(370, 48, 'Shàng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[9] = this.add.text(420, 48, 'Shuāng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.createpinyin2();
  }

  createpinyin2() {
    this.pinyin[10] = this.add.text(500, 48, 'Jǔ', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[11] = this.add.text(540, 48, 'Tóu', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[12] = this.add.text(580, 48, 'Wàng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[13] = this.add.text(625, 48, 'Míng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[14] = this.add.text(670, 48, 'Yuè', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });

    this.pinyin[15] = this.add.text(740, 48, 'Dī', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[16] = this.add.text(780, 48, 'Tóu', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[17] = this.add.text(830, 48, 'Sī', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[18] = this.add.text(870, 48, 'Gù', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.pinyin[19] = this.add.text(900, 48, 'Xiāng', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
  }
  colliderGroup() {
    this.arrayWord.forEach(word => {
      this.physics.add.collider(this[`${word}`], this.testGroup);
    });
  }
  loadPhase1() {
    this.load.image('bed', 'assets/sprites/poem/bed.png');
    this.load.image('front', 'assets/sprites/poem/front.png');
    this.load.image('bright', 'assets/sprites/poem/bright.png');
    this.load.image('moon', 'assets/sprites/poem/moon.png');
    this.load.image('light', 'assets/sprites/poem/light.png');

    this.load.image('suspect', 'assets/sprites/poem/suspect.png');
    this.load.image('is', 'assets/sprites/poem/is.png');
    this.load.image('ground', 'assets/sprites/poem/ground.png');
    this.load.image('on', 'assets/sprites/poem/on.png');
    this.load.image('frost', 'assets/sprites/poem/frost.png');

    this.load.image('raise', 'assets/sprites/poem/raise.png');
    this.load.image('head', 'assets/sprites/poem/head.png');
    this.load.image('gaze', 'assets/sprites/poem/gaze.png');

    this.load.image('lower', 'assets/sprites/poem/lower.png');

    this.load.image('think', 'assets/sprites/poem/think.png');
    this.load.image('home', 'assets/sprites/poem/home.png');
    this.load.image('town', 'assets/sprites/poem/town.png');
  }
  createWord() {
    this.bed = new Star(this, 500, 500, 'bed').setScale(1);
    this.bed.setBounce(0.5);
    this.bed.setCollideWorldBounds(true);
    this.bed.setName('bed');

    this.front = new Star(this, 100, 100, 'front').setScale(1);
    this.front.setBounce(0.5);
    this.front.setCollideWorldBounds(true);
    this.front.setName('front');

    this.bright = this.physics.add.group({
      key: 'bright',
      repeat: 1,
      setXY: { x: 100, y: 400, stepX: 50 }
    });
    this.bright.children.iterate(child => {
      child.setScale(1);
      child.setBounce(0.5);
      child.setCollideWorldBounds(true);
      child.setName('bright');
    });

    this.moon = this.physics.add.group({
      key: 'moon',
      repeat: 1,
      setXY: { x: 400, y: 400, stepX: 50 }
    });
    this.moon.children.iterate(child => {
      child.setScale(1);
      child.setBounce(0.5);
      child.setCollideWorldBounds(true);
      child.setName('moon');
    });

    this.light = new Star(this, 600, 500, 'light').setScale(1);
    this.light.setBounce(0.5);
    this.light.setCollideWorldBounds(true);
    this.light.setName('light');

    this.loadPhase2();
    this.loadPhase3();
    this.loadPhase4();
  }

  loadPhase2() {
    this.suspect = new Star(this, 60, 16, 'suspect').setScale(1);
    this.suspect.setBounce(0.5);
    this.suspect.setCollideWorldBounds(true);
    this.suspect.setName('suspect');

    this.is = new Star(this, 900, 16, 'is').setScale(1);
    this.is.setBounce(0.5);
    this.is.setCollideWorldBounds(true);
    this.is.setName('is');

    this.ground = new Star(this, 800, 16, 'ground').setScale(1);
    this.ground.setBounce(0.5);
    this.ground.setCollideWorldBounds(true);
    this.ground.setName('ground');

    this.on = new Star(this, 400, 16, 'on').setScale(1);
    this.on.setBounce(0.5);
    this.on.setCollideWorldBounds(true);
    this.on.setName('on');

    this.frost = new Star(this, 0, 16, 'frost').setScale(1);
    this.frost.setBounce(0.5);
    this.frost.setCollideWorldBounds(true);
    this.frost.setName('frost');
  }

  loadPhase3() {
    this.raise = new Star(this, 700, 500, 'raise').setScale(1);
    this.raise.setBounce(0.5);
    this.raise.setCollideWorldBounds(true);
    this.raise.setName('raise');
    this.head = this.physics.add.group({
      key: 'head',
      repeat: 1,
      setXY: { x: 600, y: 300, stepX: -50 }
    });

    this.head.children.iterate(child => {
      child.setScale(1);
      child.setBounce(0.5);
      child.setCollideWorldBounds(true);
      child.setName('head');
    });

    this.gaze = new Star(this, 950, 500, 'gaze').setScale(1);
    this.gaze.setBounce(0.5);
    this.gaze.setCollideWorldBounds(true);
    this.gaze.setName('gaze');
  }

  loadPhase4() {
    this.lower = new Star(this, 700, 16, 'lower').setScale(1);
    this.lower.setBounce(0.5);
    this.lower.setCollideWorldBounds(true);
    this.lower.setName('lower');

    this.think = new Star(this, 500, 350, 'think').setScale(1);
    this.think.setBounce(0.5);
    this.think.setCollideWorldBounds(true);
    this.think.setName('think');

    this.home = new Star(this, 700, 300, 'home').setScale(1);
    this.home.setBounce(0.5);
    this.home.setCollideWorldBounds(true);
    this.home.setName('home');

    this.town = new Star(this, 900, 500, 'town').setScale(1);
    this.town.setBounce(0.5);
    this.town.setCollideWorldBounds(true);
    this.town.setName('town');
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

  collectword(player, word) {
    if (word.name === this.arrayWord[0]) {
      this.scoreText[this.count].setColor('#ff0000');
      this.arrayWord.shift();

      this.count++;
      word.disableBody(true, true);
      console.log(typeof word.name); //get the word name
      console.log(this.arrayWord.length);

      // if (this.arrayWord.length % 5 === 0) {
      //   this.bomb = this.bombs
      //     .create(16, 16, 'bomb')
      //     .setScale(Phaser.Math.Between(1, 5));
      //   this.bomb.setBounce(1);
      //   this.bomb.setCollideWorldBounds(true);
      //   this.bomb.setVelocity(Phaser.Math.Between((-200, 200), 20));
      // }

      if (this.arrayWord.length === 0) {
        this.displayPhase();
        this.physics.pause();
      }
    }
  }

  displayPhase() {
    this.title = this.add.text(400, 300, '静夜思 by Li Bai\nJìngyè sī', {
      fontSize: 'bold 32px',
      fill: '#000',
      fontFamily: 'Times New Roman'
    });
    this.title.setOrigin(-0.1, 2);
    this.phase1 = this.add.text(
      400,
      300,
      'In front of the bed there is bright moon light\n\nIt seems like there is frost on the ground\n\nI raise my head and gaze at the bright moon\n\nI lower my head and miss my hometown   ',
      {
        fontSize: 'bold 32px',
        fill: '#000'
      }
    );
    this.phase1.setOrigin(0.4, 0.2);
    // alert(
    //   'for more information Please watch this yotube video' +
    //     'https://www.youtube.com/watch?v=82jcwYdKPTY'
    // );
  }
  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 1;
    this.scoreText.setText('Score:' + this.score);
    let xBomb = Phaser.Math.Between(0, this.height);
    let yBomb = Phaser.Math.Between(0, this.width);
    if (this.score === this.limit) {
      this.stars.children.iterate(child => {
        child.enableBody(true, child.x, 0, true, true);
      });
      this.limit = this.limit + 10;
      let x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      this.bomb = this.bombs
        .create(xBomb, yBomb, 'bomb')
        .setScale(Phaser.Math.Between(1, 5));
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
    this.gameOverText.visible = true;
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
      repeat: 13,
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

  restart(cursors) {
    // if (cursors.space.isDown) {
    //   this.scene.restart();
    // }
    if (Phaser.Input.Keyboard.JustDown(this.enter)) {
      this.scene.restart();
    }
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.dude.update(this.cursors, this.jumpSound);
    this.restart(this.cursors);
  }
}
