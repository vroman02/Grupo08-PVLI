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

        this.margen = Number.EPSILON;

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

        //Calcular la ruta que debe seguir el enemigo
        this.origen = new Phaser.Math.Vector2(this.x, this.y);
        this.vector = this.destino.clone().subtract(this.origen);
        this.vector.normalize();

        //Moverlo
        if(this.x != this.destino.x && this.y != this.destino.y)
        {
            this.x += this.vector.x * velocidad;
            this.y += this.vector.y * velocidad;
        }

        //Hacerlo cada vez más grande para que parezca que se acerca
        this.scaleX += aumentoEscala;
        this.scaleY += aumentoEscala;

        //Cuando llega al sitio donde se para debe meter daño al jugador
        if(Math.abs(this.x - this.destino.x) <= this.margen && Math.abs(this.y - this.destino.y) <= this.margen)
        {
            console.log("Ha llegado a su destino");
            //Contador
            this.time.addEvent({
                delay: 2000, // 2000 ms = 2 segundos
                callback: this.emit('recibe-daño'),
                callbackScope: this,
                loop: true
            });
        }
	}
}