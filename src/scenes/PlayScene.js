import Phaser from 'phaser';
import Ship from '../objects/Ship';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    preload() {
        this.load.image('ship', '/img/rocket-bw.png');
    }

    create() {
        this.ship = new Ship(this,this.physics.add.image(50, 50, 'ship'));
    }

    // eslint-disable-next-line no-unused-vars
    update(time, delta) {
        this.ship.handleKeyboard(this.input.keyboard);
    }
}
