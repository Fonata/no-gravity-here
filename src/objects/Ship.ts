import Phaser from "phaser";
import FireParticleEmitter from "@/animations/FireParticleEmitter";
import ObjectAffectedByGravity from "@/objects/ObjectAffectedByGravity";

class Ship extends ObjectAffectedByGravity {
    private playerColor: number = 0xFFFFFF;
    private readonly fire: Phaser.GameObjects.Particles.ParticleEmitterManager;

    private stopAngularVel: boolean = false;
    private stopLinearVel: boolean = false;
    private text: Phaser.GameObjects.Text;
    private targetAngle: number | false = false;
    private directionToTargetAngle: number = 0;
    private angleBreakingNeeded: Boolean = false;

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

        scene.input.keyboard.on('keydown-NUMPAD_ONE', () => {
            this.targetAngle = 3 / 4 * Math.PI
        });
        scene.input.keyboard.on('keydown-NUMPAD_TWO', () => {
            this.targetAngle = 2 / 4 * Math.PI
        });
        scene.input.keyboard.on('keydown-NUMPAD_THREE', () => {
            this.targetAngle = 1 / 4 * Math.PI
        });
        scene.input.keyboard.on('keydown-NUMPAD_FOUR', () => {
            this.targetAngle = Math.PI
        });
        scene.input.keyboard.on('keydown-NUMPAD_SIX', () => {
            this.targetAngle = 0
        });
        scene.input.keyboard.on('keydown-NUMPAD_SEVEN', () => {
            this.targetAngle = 5 / 4 * Math.PI
        });
        scene.input.keyboard.on('keydown-NUMPAD_EIGHT', () => {
            this.targetAngle = 6 / 4 * Math.PI
        });
        scene.input.keyboard.on('keydown-NUMPAD_NINE', () => {
            this.targetAngle = 7 / 4 * Math.PI
        });
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

    public handleKeyboard(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
        if (!this.img.visible) {
            return;
        }
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
                    this.fireThruster(-2);
                }
            } else {
                this.img.setAcceleration(0);
            }
        }
    }

    private fireThruster(angularAcc: number = 0) {
        new FireParticleEmitter(this.fire, this.img, this.scene.game, angularAcc);
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
            this.fireThruster(Math.sign(angularAcc));
            this.targetAngle = false;
            this.directionToTargetAngle = 0;
        }
        if (this.targetAngle !== false) {
            let angleDifference = this.getAngleDifference();
            const absAngleDiff = Math.abs(angleDifference);
            if (absAngleDiff > Math.PI){
                angleDifference = -1 * angleDifference;
            }
            console.log(angleDifference, this.targetAngle);
            if (absAngleDiff < 0.5 && this.angleBreakingNeeded) {
                if (this.directionToTargetAngle)
                    this.fireThruster(-this.directionToTargetAngle);
                this.img.setAngularAcceleration(this.body.angularAcceleration / 2);
            }
            if (absAngleDiff < 0.1) {
                this.angleBreakingNeeded = false;
                this.img.setRotation(this.targetAngle);
                this.img.setAngularVelocity(0);
                this.targetAngle = false;
                if (this.directionToTargetAngle)
                    this.fireThruster(-this.directionToTargetAngle);
                this.directionToTargetAngle = 0;
            } else if (!this.directionToTargetAngle) {
                this.directionToTargetAngle = -1 * Math.sign(angleDifference);
                this.fireThruster(this.directionToTargetAngle);
                angularAcc = 10 * this.directionToTargetAngle;
                this.angleBreakingNeeded = true;
                this.scene.time.delayedCall(100, this.accelerateRotation, [this])
                this.scene.time.delayedCall(150, this.accelerateRotation, [this])
                this.scene.time.delayedCall(200, this.accelerateRotation, [this])
            }
        }
        this.img.setAngularAcceleration(400 * angularAcc);
    }

    private getAngleDifference(): number {
        if (this.targetAngle === false) return 0;
        let angleDifference = this.img.rotation - this.targetAngle;
        if (angleDifference > 2 * Math.PI) angleDifference -= 2 * Math.PI;
        if (angleDifference < -2 * Math.PI) angleDifference += 2 * Math.PI;
        return angleDifference;
    }

    private static  accelerateRotation(ship: Ship ) {
        if (!ship.img.visible) {
            return;
        }
        if (Math.abs(ship.getAngleDifference()) < 0.4) {
            // No acceleration needed
            return;
        }
        ship.fireThruster(ship.directionToTargetAngle);
        ship.img.setAngularAcceleration(200 * ship.directionToTargetAngle);
    }
}

export default Ship;
