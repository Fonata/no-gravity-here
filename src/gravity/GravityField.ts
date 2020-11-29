import ObjectAffectedByGravity from "@/objects/ObjectAffectedByGravity";
import Phaser from "phaser";

class GravityField {
    public affectedObjects: ObjectAffectedByGravity[] = [];
    protected scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public create() {
    }

    public updateObjects(delta: number) {
        for (let affectedObject of this.affectedObjects) {
            this.updateObject(affectedObject,delta);
        }
    }

    protected updateObject(affectedObject: ObjectAffectedByGravity,delta:number) {
    }
}

export default GravityField;
