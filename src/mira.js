export default class mira extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'mira');
        this.setOrigin(0.5);
        scene.add.existing(this);
    }

    update(t, dt)
    {
        //Seguir al ratón
        const pointer = this.scene.input.activePointer;
        this.x = pointer.x;
        this.y = pointer.y;
    }
}