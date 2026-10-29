export default class Limpieza_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'limpieza-minigame' });
        }


     preload()
    {
        this.load.image('esponja', 'assets/minigames/Limpieza/esponja.png');
        this.load.image('pared', 'assets/minigames/Limpieza/Pared.jpg');
        this.load.image('grafitti', 'assets/minigames/Limpieza/Graffiti-set/Graffiti-set/0_Tags/tag6.png');
    }

    create(){

        const fondo = this.add.image(480, 270, 'pared');
        fondo.setDisplaySize(960, 540);
        
        //Imagen del grafitti
        const pintura = this.add.image(450, 270, 'grafitti');
        pintura.setDisplaySize(560, 450);

        //Imagen de la esponja
        const espon = this.add.image(450, 270, 'esponja');
       



        //Boton volver
        const boton = this.add.text(825, 480, 'VOLVER', {
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
            this.scene.start('selector-minigames');
        });
    }



}