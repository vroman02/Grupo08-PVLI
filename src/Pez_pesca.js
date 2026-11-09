export default class Pez_pesca extends Phaser.GameObjects.Image {
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'pez');
        scene.add.existing(this);
        this.VEL = 0.5;
        this.velocidad = this.VEL;
        
    }

    preload()
    {
        
    }

    create()
    {
        
    }

    update(t, dt)
	{
        const X1 = 200;
        const X2 = 800;
		this.x += this.velocidad * dt
        if (this.x >= X2) 
        {
            this.velocidad = -this.VEL;
            this.setFlipX(true);
        }
        else if (this.x <= X1)
        {
           this.velocidad = this.VEL;
           this.setFlipX(false);
        }
            
        
	}


}