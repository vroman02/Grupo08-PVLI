export default class Shooter_zigzagEnemy extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'enemigoZigzag');
        this.setOrigin(0.5, 0.5); 
        scene.add.existing(this);

        this.destinoY = 450;
        this.margen = 5;
        this.topeAncho = 850;
        this.topeAlto = 1050;
        this.haLlegado = false;
        this.daño = 10;
        this.indiceWaypoint = 0;

        // Carriles del zigzag
        const xIzq = 250;
        const xDer = 710;

        //Si aparece en la mitad izquierda, empieza yendo a la derecha, si no, va a la izquierda
        let alternar = x < 480;
        const numZigs = 4;
        const deltaY  = (this.destinoY - y) / numZigs;

        this.waypoints = [];
        for (let i = 0; i < numZigs; i++)
        {
            let wpX = xIzq;
            if (alternar) wpX = xDer;

            this.waypoints.push(new Phaser.Math.Vector2(wpX, y + deltaY * i));
            alternar = !alternar;
        }
    }

    update(t, dt)
    {
        const velocidad = 0.6 * dt;
        const aumentoEscala = 0.0001 * dt;
        const puedeCrecer = this.displayWidth  < this.topeAncho && this.displayHeight < this.topeAlto;

        if (this.haLlegado)
        {
            if (puedeCrecer) 
            { 
                this.scaleX += aumentoEscala; 
                this.scaleY += aumentoEscala; 
            }
            return;
        }

        //Si ya no hay waypoints ha llegado al final
        if (this.indiceWaypoint >= this.waypoints.length)
        {
            this.haLlegado = true;
            this.timerDaño = this.scene.time.addEvent({
                delay: 2000,
                callback: () => this.emit('recibe-daño'),
                loop: true
            });
            return;
        }

        const destino = this.waypoints[this.indiceWaypoint];
        this.origen = new Phaser.Math.Vector2(this.x, this.y);
        this.vector = destino.clone().subtract(this.origen);
        const distancia = this.vector.length();

        if (distancia <= this.margen || distancia <= velocidad)
        {
            this.x = destino.x;
            this.y = destino.y;
            this.indiceWaypoint++;
            return;
        }

        this.vector.normalize();
        this.x += this.vector.x * velocidad;
        this.y += this.vector.y * velocidad;

        if (puedeCrecer)
        {
            this.scaleX += aumentoEscala;
            this.scaleY += aumentoEscala;
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