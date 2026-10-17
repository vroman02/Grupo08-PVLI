export default class EscenaPrueba extends Phaser.Scene 
{

// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'escena-prueba' });
        }

    create(){


        //fondo verdeee para que destaque
        this.cameras.main.setBackgroundColor('#3dd429');

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
        //boton.setInteractive({ useHandCursor: true });
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

        //esto es para cuando has pulsado, aqui teneis q vincular vuestras escenas @marcos @victor
        boton.on('pointerdown', () => {
                //console.log('Has pulsado JUGAR');
                 this.scene.start('menu-principal');
            });










    }












}