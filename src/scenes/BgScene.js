import 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>

    this.load.image('BG', 'assets/backgrounds/BG.png');
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    this.add.image(0, 0, 'BG').setOrigin(0, 0);
  }
}
