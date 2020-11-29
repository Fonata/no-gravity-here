import Phaser from 'phaser';

let anim: false | Phaser.Animations.Animation;

class X extends Phaser.GameObjects.Particles.Particle {
    private t: number = 0;
    private i: number = 0;

    update(delta: number, step: number, processors: any[]) {
        var result = super.update(delta, step, processors);
        if (anim === false) throw new Error();

        this.t += delta;

        if (this.t >= anim.msPerFrame) {
            this.i++;

            if (this.i >= anim.frames.length) {
                this.i = 0;
            }

            this.frame = anim.frames[this.i].frame;

            this.t -= anim.msPerFrame;
        }

        return result;
    }
}

class FireParticleEmitter {
    constructor(emitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager, img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, game: Phaser.Game, angularAcc = 0) {
        if (!anim) {
            anim = game.anims.create({
                key: 'fire',
                frames: [
                    // @ts-ignore
                    {key: 'flame1'},
                    // @ts-ignore
                    {key: 'flame2'},
                ],
                repeat: -1,
                frameRate: 6
            });
        }

        let cos = Math.cos(img.rotation) * img.scaleX;
        let sin = Math.sin(img.rotation) * img.scaleY;
        let flameRadians = img.rotation + Math.PI * (angularAcc) / 2;
        let flameAngle = flameRadians / Math.PI * 180;
        let emitterConfig = {
            alpha: {start: 1, end: 0},
            scale: {start: 0.5, end: 0},
            angle: {min: flameAngle - 30, max: flameAngle + 30},
            rotate: flameAngle - 90,
            lifespan: {min: 1000, max: 1100},
            blendMode: 'ADD',
            frequency: 110,
            speedX: img.body.velocity.x - 60 * Math.cos(flameRadians),
            speedY: img.body.velocity.y - 60 * Math.sin(flameRadians),
            maxParticles: 1,
            x: img.x - 60 * cos,
            y: img.y - 60 * sin,
            particleClass: X
        };
        if (Math.abs(angularAcc) == 1) {
            // Thrusters for the rotation of the ship
            emitterConfig.scale.start = 0.1
            let offset = emitterConfig.scale.start * 65;
            if (angularAcc < 0) offset -= 10;
            emitterConfig.x = img.x - offset * sin + 35 * cos;
            emitterConfig.y = img.y - offset * cos + 35 * sin;
            emitterConfig.rotate = flameAngle;
        }
        if (angularAcc == -2) {
            // we are braking
            emitterConfig.scale.start /= 2;
            emitterConfig.x += 70 * cos;
            emitterConfig.y += 70 * sin;
            emitterConfig.maxParticles = 2;
        }
        // @ts-ignore
        let e = emitterManager.createEmitter(emitterConfig);
    }
}

export default FireParticleEmitter;
