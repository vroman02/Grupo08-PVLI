export default class Shooter_enemy extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'enemigo');
        this.setOrigin(0.5, 0.5); 
        scene.add.existing(this);

        this.destino = new Phaser.Math.Vector2();
        this.destino.x = Phaser.Math.Between(200, 760);
        this.destino.y = 450;

        this.margen = 5;
        this.topeAncho = 850;
        this.topeAlto  = 1050;
        this.haLlegado = false;
        this.daño = 10;
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
        const velocidad = 0.1 * dt;
        const aumentoEscala = 0.0001 * dt;

        const puedeCrecer = this.displayWidth < this.topeAncho && this.displayHeight < this.topeAlto;

        if (this.haLlegado && puedeCrecer)
        {
            this.scaleX += aumentoEscala;
            this.scaleY += aumentoEscala;
            return;
        } 

        //Calcular la ruta que debe seguir el enemigo
        this.origen = new Phaser.Math.Vector2(this.x, this.y);
        this.vector = this.destino.clone().subtract(this.origen);
        const distancia = this.vector.length();

        if (distancia <= this.margen || distancia <= velocidad) {
            this.x = this.destino.x;
            this.y = this.destino.y;
            this.haLlegado = true;
            console.log("Ha llegado a su destino");
            this.scene.time.addEvent({
                delay: 2000,
                callback: () => this.emit('recibe-daño'),
                loop: true
            });

        }
        else
        {
            //Moverlo
            this.vector.normalize();
            this.x += this.vector.x * velocidad;
            this.y += this.vector.y * velocidad;

            //Hacerlo cada vez más grande para que parezca que se acerca hasta un tope
            if(puedeCrecer)
            {
                this.scaleX += aumentoEscala;
                this.scaleY += aumentoEscala;
            }
        }
	}

    destroy(fromScene) 
    {
        if (this.timerDaño) 
        {
            this.timerDaño.remove(false);
            this.timerDaño = null;
        }
        super.destroy(fromScene);
    }
}