export default class Shooter_enemy extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'enemigo');
        this.setOrigin(0.5, 0.5); 
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
		const velocidad = 0.1 * dt;
        const aumentoEscala = 0.0001 * dt;

        //Calcular la ruta que debe seguir el enemigo
        this.origen = new Phaser.Math.Vector2(this.x, this.y);
        this.destino = new Phaser.Math.Vector2(480, 540);
        this.vector = this.destino.clone().subtract(this.origen);
        this.vector.normalize();

        //Moverlo
        this.x += this.vector.x * velocidad;
        this.y += this.vector.y * velocidad;

        //Hacerlo cada vez más grande para que parezca que se acerca
        this.scaleX += aumentoEscala;
        this.scaleY += aumentoEscala;   
	}
}