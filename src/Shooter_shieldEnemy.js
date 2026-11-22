export default class Shooter_enemy extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'enemigoEscudo');
        this.setOrigin(0.5, 0.5); 
        scene.add.existing(this);

        this.destino = new Phaser.Math.Vector2();
        if(this.x <= 480) this.destino.x = 1100;
        else this.destino.x = -150;
        this.destino.y = this.y;

        this.margen = 5;
        this.haLlegado = false;
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
        if (this.haLlegado) 
        {
            this.destroy();
            return;
        } 

        const velocidad = 0.05 * dt;

        //Calcular la ruta que debe seguir el enemigo
        this.origen = new Phaser.Math.Vector2(this.x, this.y);
        this.vector = this.destino.clone().subtract(this.origen);
        const distancia = this.vector.length();

        if (distancia <= this.margen || distancia <= velocidad) {
            this.x = this.destino.x;
            this.y = this.destino.y;
            this.haLlegado = true;
            
            console.log("Ha llegado a su destino");
        }
        else
        {
            //Moverlo
            this.vector.normalize();
            this.x += this.vector.x * velocidad;
        }
	}

    destroy(fromScene) 
    {
        super.destroy(fromScene);
    }
}