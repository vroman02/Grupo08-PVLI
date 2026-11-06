import Pez_pesca from "./Pez_pesca.js";

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
        
        //Crear pez
        this.pez = new Pez_pesca(this, 100, 300)
        this.pez.setDisplaySize(180, 225);

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

        const sedal = this.add.text(400, 425, 'PESCAR', {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 15, y: 10 }
        });

        sedal.setOrigin(0.5);
        sedal.setInteractive({ useHandCursor: true });

        sedal.on('pointerover', () => {
            sedal.setStyle({
                color: '#ffffff',
                backgroundColor: '#da0000'
            });
        });

        sedal.on('pointerout', () => {
            sedal.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        sedal.on('pointerdown', () => {
            if (this.pez.x < 600 && this.pez.x > 500)
            {
                this.pez.setVisible(false);
            }
        });
    }

    update(t, dt)
    {
        if (this.pez)
        {
            this.pez.update(t, dt);
        }
    }



}