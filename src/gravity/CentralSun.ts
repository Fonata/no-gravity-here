import GravityField from "@/gravity/GravityField";
import ObjectAffectedByGravity from "@/objects/ObjectAffectedByGravity";
import Phaser from "phaser";

class CentralSun extends GravityField {
    private sun: Phaser.GameObjects.Graphics;

    private radius = 20;

    private readonly x: number;
    private readonly y: number;

    constructor(scene: Phaser.Scene) {
        super(scene);

        let canvas = this.scene.game.canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        var circle = new Phaser.Geom.Circle(this.x, this.y, this.radius);

        this.sun = this.scene.add.graphics({fillStyle: {color: 0xffff00}})
            .fillCircleShape(circle);
    }

    protected updateObject(affectedObject: ObjectAffectedByGravity, delta: number) {
        if (!affectedObject.img.visible) {
            return;
        }
        let x2 = affectedObject.body.x;
        let y2 = affectedObject.body.y;
        const distance = Phaser.Math.Distance.Between(this.x, this.y, x2, y2);
        if (this.radius > distance) {
            affectedObject.img.visible = false;
            if (affectedObject.isPlayer) {
                this.scene.game.scene.start('GameOverScene');
            }
        }

        const distance3 = distance * distance * distance;
        const weight = 10000;
        affectedObject.body.velocity.x += weight / distance3 * delta * (this.x - x2);
        affectedObject.body.velocity.y += weight / distance3 * delta * (this.y - y2);
    }
}

export default CentralSun;
