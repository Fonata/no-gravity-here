import Phaser from "phaser";

class ObjectAffectedByGravity {
    public readonly img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    protected scene: Phaser.Scene;
    public body: Phaser.Physics.Arcade.Body;
    public isPlayer: boolean = false;

    constructor(scene: Phaser.Scene, image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        this.img = image;
        this.scene = scene;
        if (!(image.body instanceof Phaser.Physics.Arcade.Body))
            throw new Error();
        this.body = image.body;
    }
}

export default ObjectAffectedByGravity;
