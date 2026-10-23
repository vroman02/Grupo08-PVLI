export default class manolo extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'dum');
        this.setOrigin(0,0);
        scene.add.existing(this);
    }

    preload()
    {
        
    }

    create()
    {
        
    }

    preupdate(t, dt)
    {
        
    }

    update(t, dt)
	{
		this.x += 1;
	}

}