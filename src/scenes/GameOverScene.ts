import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super('GameOverScene');
    }

    create() {
        // Shake the camera
        const camera = this.cameras.main;
        camera.shake(500);

        let game = this.game;
        this.time.delayedCall(500, function () {
            game.scene.stop('PlayScene');
        });

        this.time.delayedCall(1500, function () {
            // New game
            game.scene.stop('GameOverScene');
            game.scene.start('PlayScene');
        });

        this.add.text(60, 60, 'GAME OVER', {
            fontFamily: 'Courier New',
            color: 'red',
            fontSize: 100,
        })
    }
}
