import 'phaser';
import FgScene from './FgScene';
import BgScene from './BgScene';
export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    this.scene.launch('BgScene');
    this.scene.launch('FgScene');
  }
}
