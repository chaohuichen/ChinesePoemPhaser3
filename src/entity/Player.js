import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.facingLeft = false;
    this.body.setCollideWorldBounds(true);
  }

  updateMovement(cursors) {
    //move left
    if (cursors.left.isDown) {
      if (!this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = true;
      }
      this.setVelocityX(-360);
      if (this.body.touching.down) {
        this.play('run', true);
      }
    }
    //move right
    else if (cursors.right.isDown) {
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
      }
      this.setVelocityX(360);
      if (this.body.touching.down) {
        this.play('run', true);
      }
    }
    // Netural (no movement)
    else {
      this.setVelocityX(0);
      this.play('stand', true);
    }
  }

  updateJump(cursors, jumpSound) {
    if (cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-450);
      this.play('jump', true);
      // jumpSound.play();
    }
  }

  updateInAir() {
    if (!this.body.touching.down) {
      this.play('jump');
    }
  }

  // Check which controller button is being pushed and execute movement & animation
  update(cursors, jumpSound) {
    // << INSERT CODE HERE >>
    this.updateMovement(cursors);
    this.updateJump(cursors, jumpSound);
    this.updateInAir();
  }
}
