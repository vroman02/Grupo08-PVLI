export default class Kendama_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'kendama-minigame' });
        }


     preload()
    {
        this.load.image('kendama', 'assets/minigames/Kendama/kendama.png');
        this.load.image('calle', 'assets/minigames/Kendama/Fondo_Japones.png');
    }

    create(){

        const fondo = this.add.image(480, 270, 'calle');
        fondo.setDisplaySize(960, 540);
        
        //Imagen de la bomba
        const bomba = this.add.image(450, 270, 'kendama');
        bomba.setDisplaySize(360, 450);

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