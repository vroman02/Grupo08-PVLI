export default class Esponja extends Phaser.GameObjects.Image {
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'esponja');
        scene.add.existing(this);
        //entrada del ratón
        this.pointer = scene.input.activePointer;
    }

    

    preload()
    {
        
    }

    create()
    {
        
    }

    update()
	{
        this.x = this.pointer.worldX;
        this.y = this.pointer.worldY;
	}
}