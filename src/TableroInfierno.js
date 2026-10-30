export default class TableroDeJuegoInfierno extends Phaser.Scene 
{
    // Nombre de la escena para el SceneManager
    constructor() 
    {
        super({ key: 'tablero-infierno' });
    }

    //LAS IMAGENES SE HAN CARGADO EN EL PRELOAD

    create()
    {
        this.cameras.main.setBackgroundColor('#000000');

        //Tablero del juego normal Placeholder
        const tableroInfierno = this.add.image(480, 270, 'tablero-infierno');
        tableroInfierno.setDisplaySize(960, 540);

        //Personaje Placeholder
        const personaje = this.add.image(75, 400, 'personaje-principal');
        personaje.setDisplaySize(150, 150);

        //Boton volver
        const boton = this.add.text(825, 500, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        boton.setOrigin(0.5);
        boton.setInteractive({ useHandCursor: true });

        boton.on('pointerover', () => {
            boton.setStyle({
                color: '#ffffff',
                backgroundColor: '#2274d7'
            });
        });

        boton.on('pointerout', () => {
            boton.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        boton.on('pointerdown', () => {
            this.scene.start('menu-principal');
        });
    }
}