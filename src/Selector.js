
export default class Selector extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'selector-minigames' });
    }

     preload()
    {

            //fuente
        this.loadFont('Isometra', 'assets/fonts/Isometra-Regular.ttf');

        
    }

    loadFont(name, url) 
    {
        let newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }

    create()
    {
        this.cameras.main.setBackgroundColor('#fae06e');

        //Titulo
        this.add.text(500, 40, 'MINIJUEGOS', {
            fontFamily: 'Isometra',
            fontSize: '40px',
            color: '#000000'
        }).setOrigin(0.5);

        //BOTONESSS
        // Columna izquierda
        this.crearBoton(200, 200, 'BOMBA', () => {
            this.scene.start('bomba-minigame');
        });

        this.crearBoton(200, 300, 'Kendama', () => {
            this.scene.start('kendama-minigame');
        });

        this.crearBoton(200, 400, 'Limpieza', () => {
            this.scene.start('limpieza-minigame');
        });

        // Columna derecha
        this.crearBoton(700, 200, 'PESCA', () => {
            this.scene.start('pesca-minigame');
        });

        this.crearBoton(700, 300, 'PROFESOR', () => {
           this.scene.start('profesor-minigame');
        });

        this.crearBoton(700, 400, 'SHOOTER', () => {
           this.scene.start('shooter-minigame');
        });

        // Volver al menú principal
        this.crearBoton(900, 500, 'VOLVER', () => {
            this.scene.start('menu-principal');
        });
    }

    crearBoton(x, y, texto, accion)
    {
        const boton = this.add.text(x, y, texto, {
            fontFamily: 'Isometra',
            fontSize: '20px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 30, y: 15 }
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

        boton.on('pointerdown', accion);
    }
}
