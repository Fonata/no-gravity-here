import Phaser from 'phaser';
import Ship from '../objects/Ship';
import GravityField from "@/gravity/GravityField";
import CentralSun from "@/gravity/CentralSun";

export default class PlayScene extends Phaser.Scene {
    private ship: null | Ship = null;
    private gravityField: null | GravityField = null;

    constructor() {
        super('PlayScene');
    }

    create() {
        this.addPlayer(200, 400).body.setVelocity(0, 200).rotation = 90;
    }

    private addPlayer(x: number, y: number) {
        this.ship = new Ship(this, this.physics.add.image(x, y, 'ship'));
        this.ship.isPlayer = true;
        this.gravityField?.affectedObjects.push(this.ship);
        return this.ship;
    }

    preload() {
        this.load.image('ship', '/img/rocket-bw.png');
        this.load.image('flame1', '/img/flame1.png');
        this.load.image('flame2', '/img/flame2.png');
        this.gravityField = new CentralSun(this);
    }

    // @ts-ignore
    update(time, delta) {
        this.ship?.handleKeyboard(this.input.keyboard);
        this.gravityField?.updateObjects(delta);
    }
}
