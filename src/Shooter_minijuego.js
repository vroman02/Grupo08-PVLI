export default class Shooter_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'shooter-minigame' });
        }


     preload()
    {
        this.load.image('fabrica', 'assets/minigames/Shooter/FondoFabrica.png');
        this.load.image('pistola', 'assets/minigames/Shooter/pistola.png');

    }

    create(){

        const fondo = this.add.image(480, 270, 'fabrica');
        fondo.setDisplaySize(960, 740);


        const prof2 = this.add.image(450, 270, 'pistola');
        prof2.setDisplaySize(360, 450);




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