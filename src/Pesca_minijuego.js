export default class Pesca_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'pesca-minigame' });
        }


     preload()
    {
        this.load.image('pez', 'assets/minigames/Pesca/koi_imbecil.png');
        this.load.image('barco', 'assets/minigames/Pesca/barco.png');
        this.load.image('cania', 'assets/minigames/Pesca/individual.png');
    }

    create(){

        const fondo = this.add.image(480, 270, 'barco');
        fondo.setDisplaySize(960, 540);
        
        //Imagen del grafitti
        const pescado = this.add.image(450, 270, 'pez');
        pescado.setDisplaySize(360, 450);

        //Imagen de la esponja
        const can = this.add.image(450, 270, 'cania');
        can.setDisplaySize(360, 750);



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