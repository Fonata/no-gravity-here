import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const config = {
    width: 800,
    height: 600,
    background: 'purple',
    type: Phaser.AUTO,
    audio: {
        disableWebAudio: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: {y: 0},
        },
    },
};

const game = new Phaser.Game(config);

game.scene.add('PlayScene', PlayScene);

game.scene.start('PlayScene');
