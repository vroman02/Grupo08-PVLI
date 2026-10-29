export default class Profesor_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'profesor-minigame' });
        }


     preload()
    {
        this.load.image('contento', 'assets/minigames/Profesor/Profe_Contento_Editado.png');
        this.load.image('enfadado', 'assets/minigames/Profesor/Profe_Enfadao_Editado.jpg');

    }

    create(){

        const prof1 = this.add.image(480, 270, 'contento');
        prof1.setDisplaySize(960, 540);


        const prof2 = this.add.image(450, 270, 'enfadado');
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