import manolo from "./manolo.js";

export default class EscenaPrueba extends Phaser.Scene 
{
    constructor()
    {
        super({ key: 'escena-manolo' })
    }

    preload()
    {
        this.load.image('prao4k', 'assets/backgrounds/prao4k.png');
        this.load.image('dum', 'assets/characters/DoctorMuerte.png');
    }

    create()
    {
        const fondo = this.add.image(960, 540, 'prao4k');
        fondo.setDisplaySize(1920, 1080);

        let dum = new manolo(this, 900, 125)

        //Botón volver
        let boton = this.add.text(1650, 650, 'VOLVER', {
        fontSize: '100px',
        //esta fuente la he pillado de x ahí porque la default es horrible
        fontFamily: 'Isometra',
        color: '#90beff',
        backgroundColor: '#ffffff',
        padding: { x: 30, y: 15 }
        });

        boton.setOrigin(0.5);

        boton.setInteractive( new Phaser.Geom.Rectangle(0, 0, boton.width, boton.height),Phaser.Geom.Rectangle.Contains);

        boton.on('pointerover', () => {
            boton.setStyle({
                color: '#ffffff',
                backgroundColor: '#83e5ee'
            });
        });

        boton.on('pointerout', () => {
                boton.setStyle({
                    color: '#000000',
                    backgroundColor: '#ffffff'
                });
        });

        boton.on('pointerdown', () => {
                //console.log('Has pulsado JUGAR');
                 this.scene.start('menu-principal');
        });
        
    }
}