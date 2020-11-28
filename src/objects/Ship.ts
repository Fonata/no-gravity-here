import Phaser from "phaser";

class Ship {
    private img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        this.img = image;
        this.scene = scene;
        image.setAngularDrag(30);
        image.setDrag(0.99);
        image.setMaxVelocity(150);
        image.setCollideWorldBounds(true);

    }

    handleKeyboard(keyboard) {
        let cursors = keyboard.createCursorKeys();

        if (cursors.up.isDown) {
            this.img.setAcceleration(this.img.body.acceleration + 100);
        } else {
            this.img.setAcceleration(0);
        }

        if (cursors.left.isDown) {
            this.img.setAngularAcceleration(-100);
        } else if (cursors.right.isDown) {
            this.img.setAngularAcceleration(100);
        } else {
            this.img.setAngularAcceleration(0);
        }
    }
}

export default Ship;
