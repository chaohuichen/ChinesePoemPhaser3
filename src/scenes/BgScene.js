import 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>

    this.load.image('sky', 'assets/backgrounds/sky.png');
    this.load.image('logo', 'assets/backgrounds/fullBlastLogo.png');
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
  }
}
