import Esponja from "./Limpieza_esponja.js";

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

        //Imagen del fondo
        const fondo = this.add.image(480, 270, 'pared');
        fondo.setDisplaySize(960, 540);
        
        //Se crea el grafitti
        const grafitti = this.add.image(450, 270, 'grafitti');
        grafitti.setDisplaySize(840, 540);

        //Se crea la máscara
        this.mascara = this.add.renderTexture(480, 270, 960, 540);
        this.mascara.fill(0xffffff);
        this.mascara.render();
        grafitti.enableFilters().filters.external.addMask(this.mascara);
        this.mascara.setVisible(false);

        //Se borra el grafitti
        this.input.on('pointermove', pointer =>
        {
            if (pointer.isDown)
            {
                this.mascara.erase(this.espon).render();
            }

        });


        //Imagen de la esponja
        this.espon = new Esponja(this, 450, 270);
        this.espon.setDisplaySize(100,100);

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

    update()
    {
        this.espon.update();
    }


}