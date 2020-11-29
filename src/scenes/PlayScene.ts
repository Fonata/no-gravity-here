import Phaser from 'phaser';
import Ship from '../objects/Ship';

export default class PlayScene extends Phaser.Scene {
    private ship: null | Ship = null;

    constructor() {
        super('PlayScene');
    }

    create() {
        this.ship = new Ship(this, this.physics.add.image(50, 50, 'ship'));
    }

    preload() {
        this.load.image('ship', '/img/rocket-bw.png');
        this.load.image('flame1', '/img/flame1.png');
        this.load.image('flame2', '/img/flame2.png');
    }

    // @ts-ignore
    update(time, delta) {
        this.ship?.handleKeyboard(this.input.keyboard);
    }
}
