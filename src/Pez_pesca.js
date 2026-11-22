export default class Pez_pesca extends Phaser.GameObjects.Image {
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'pez');
        scene.add.existing(this);
        this.VEL = 0.75;
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
        if (this.x < 600 && this.x > 500)
        {
            this.setAlpha(1);
            this.setDisplaySize(150, 187);
            this.setTint(0xff8888);
        }
        else
        {
            this.setAlpha(0.75);
            this.setDisplaySize(120, 150);
            this.clearTint();
        }
            
        
	}


}