export default class manolo extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'dum');
        this.setOrigin(0,0);
        scene.add.existing(this);
        this.teclas = scene.input.keyboard.createCursorKeys();
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
		const velocidad = 0.5 * dt;

        if (this.teclas.left.isDown)
        {
            this.x -= velocidad;
        } 
        if (this.teclas.right.isDown) 
        {
            this.x += velocidad;
        }
        if (this.teclas.up.isDown) 
        {
            this.y -= velocidad;
        }
        if (this.teclas.down.isDown)
        {
            this.y += velocidad;
        }
	}

}