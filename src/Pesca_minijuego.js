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
        this.load.image('pezpescao', 'assets/minigames/Pesca/koi_anzuelo.png');
        this.load.image('medidorvacio', 'assets/minigames/Pesca/Medidor_vacio.png');
        this.load.image('medidor1', 'assets/minigames/Pesca/Medidor1.png');
        this.load.image('medidor2', 'assets/minigames/Pesca/Medidor2.png');
        this.load.image('medidor3', 'assets/minigames/Pesca/Medidor3.png');
        this.load.image('salpicar', 'assets/minigames/Pesca/Salpicadura.png');
    }

    create(){

        this.fase = 0;
        this.fallos = 0;
        this.peznt = false;

        //Crear fondo
        const fondo = this.add.image(480, 270, 'barco');
        fondo.setDisplaySize(960, 540);

        //Crear medidores
        this.medidorfasevacio = this.add.image(50, 150, 'medidorvacio');
        this.medidorfasevacio.setDisplaySize(100, 300);

        this.medidorfase1 = this.add.image(50, 150, 'medidor1');
        this.medidorfase1.setDisplaySize(110, 300);
        this.medidorfase1.setVisible(false);

        this.medidorfase2 = this.add.image(50, 150, 'medidor2');
        this.medidorfase2.setDisplaySize(100, 300);
        this.medidorfase2.setVisible(false);

        this.medidorfase3 = this.add.image(50, 150, 'medidor3');
        this.medidorfase3.setDisplaySize(100, 300);
        this.medidorfase3.setVisible(false);
       
        
        //Crear pez
        this.pez = new Pez_pesca(this, 100, 300)
        this.pez.setDisplaySize(180, 225);

        //Crear pez pescao
        this.pescao = this.add.image(470, 290, 'pezpescao')
        this.pescao.setDisplaySize(200, 225);
        this.pescao.setVisible(false);

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

        const sedal = this.add.text(475, 500, 'PESCAR', {
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
            if (this.fase < 3 && this.fallos < 3)
            {
                if (this.pez.x < 600 && this.pez.x > 500)
                {
                    this.fase++;
                }
                else
                {
                    if (this.fase > 0)
                    {
                        this.fase--;
                    }
                    this.fallos++;
                }
            }
            
        });
    }

    update(t, dt)
    {
        if (this.pez && this.fase < 3 && this.fallos < 3)
        {
            this.pez.update(t, dt);
        }
        if (this.fase == 0)
        {
            this.medidorfasevacio.setVisible(true);
            this.medidorfase1.setVisible(false);
        }
        else if (this.fase == 1)
        {
            this.medidorfasevacio.setVisible(false);
            this.medidorfase1.setVisible(true);
            this.medidorfase2.setVisible(false);
        }
        else if (this.fase == 2)
        {
            this.medidorfase1.setVisible(false);
            this.medidorfase2.setVisible(true);
            this.medidorfase3.setVisible(false);
        }
        else if (this.fase == 3)
        {
            this.medidorfase2.setVisible(false);
            this.medidorfase3.setVisible(true);

            this.pez.setVisible(false);
            this.pescao.setVisible(true);
        }
        if (this.fallos == 3 && !this.peznt)
        {
            this.pez.setVisible(false);
            const salpicadura = this.add.image(this.pez.x, this.pez.y, 'salpicar');
            salpicadura.setDisplaySize(200, 100);
            this.peznt = true;
        }
        
    }

}