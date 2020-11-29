import Phaser from "phaser";
import FireParticleEmitter from "@/animations/FireParticleEmitter";
import ObjectAffectedByGravity from "@/objects/ObjectAffectedByGravity";

class Ship extends ObjectAffectedByGravity {
    private playerColor: number = 0xFFFFFF;
    private readonly fire: Phaser.GameObjects.Particles.ParticleEmitterManager;

    private stopAngularVel: boolean = false;
    private stopLinearVel: boolean = false;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        super(scene, image);

        image.setCollideWorldBounds(true);
        image.depth = 999; // render in front of the fire
        this.text = scene.add.text(5, 5, '');

        this.setRandomColor();
        this.fire = scene.add.particles('flame1');
        scene.input.on('pointerdown', (pointer: PointerEvent) => {
            scene.add.image(pointer.x, pointer.y - 60, this.fire.texture);
        }, this);
    }

    private setRandomColor() {
        const i = Phaser.Math.Between(0, 359);
        const hsv = Phaser.Display.Color.HSVColorWheel();

        // @ts-ignore
        this.setPlayerColor(hsv[i].color);
    }

    public setPlayerColor(playerColor: number) {
        this.playerColor = playerColor;
        this.img.setTint(playerColor);
        this.text.setColor('#' + playerColor.toString(16));
    }

    handleKeyboard(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
        let cursors = keyboard.createCursorKeys();

        this.handleSpeed(cursors);
        this.handleRotation(cursors);
    }

    private handleSpeed(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        let speed = Math.round(this.body.velocity.length());
        this.text.text = `Speed: ${speed}`;
        if (cursors.up?.isDown) {
            this.body.acceleration.setToPolar(this.img.rotation, 800);
            new FireParticleEmitter(this.fire, this.img, this.scene.game);
            this.stopLinearVel = false;
        } else {
            if (cursors.down?.isDown) {
                this.stopLinearVel = true;
            }
            if (this.stopLinearVel) {
                if (speed < 3) {
                    this.stopLinearVel = false;
                    this.body.setVelocity(0);
                } else {
                    this.body.acceleration.setToPolar(this.body.velocity.angle() - Math.PI, 2 * speed);
                    new FireParticleEmitter(this.fire, this.img, this.scene.game, -2);
                }
            } else {
                this.img.setAcceleration(0);
            }
        }
    }

    private handleRotation(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        let angularAcc = 0;
        if (this.stopAngularVel) {
            let angularVel = this.body.angularVelocity;
            angularAcc = -2 * Math.sign(angularVel);
            if (Math.abs(angularVel) < 10) {
                this.stopAngularVel = false;
                angularAcc = 0;
            }
        }
        if (cursors.space?.isDown) {
            this.stopAngularVel = true;
        }
        if (cursors.left?.isDown) {
            angularAcc = -1;
        } else if (cursors.right?.isDown) {
            angularAcc = 1;
        }
        if (angularAcc) {
            new FireParticleEmitter(this.fire, this.img, this.scene.game, Math.sign(angularAcc));
        }
        this.img.setAngularAcceleration(400 * angularAcc);
    }
}

export default Ship;
