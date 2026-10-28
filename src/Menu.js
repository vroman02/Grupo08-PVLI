
export default class Menu extends Phaser.Scene 
{
    // Nombre de la escena para el SceneManager
    constructor() 
    {
            super({ key: 'menu-principal' });
    }

    preload()
    {

            //fuente
        this.loadFont('Isometra', 'assets/fonts/Isometra-Regular.ttf');

        //esto es para cargar imágenes y recursos
        this.load.video('logo-vivo3D','assets/menu/logo3D.webm');
        
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


        //fondo amarillo para que destaque
        this.cameras.main.setBackgroundColor('#f1a53b');



        //logo del juego
        const logo = this.add.video(40, 40, 'logo-vivo3D');
        logo.setDisplaySize(75,75);
        logo.setPosition(250, 215);
        logo.play(true);
        //logo.setOrigin(0, 0);


        //BOTONES////////////

        //Botón Jugar
        let boton = this.add.text(825, 320, 'JUGAR', {
        fontFamily: 'Isometra',
        fontSize: '50px',
        //esta fuente la he pillado de x ahí porque la default es horrible
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
            this.scene.start('escena-manolo');
                console.log('Has pulsado JUGAR');
            });

        
        //BOTON DE OCPIONES////////////

        let botonOpciones = this.add.text(785, 400, 'OPCIONES', {
        fontSize: '50px',
        fontFamily: 'Isometra',
        color: '#000000',
        backgroundColor: '#2274d7',
        padding: { x: 30, y: 15 }
        });

        botonOpciones.setOrigin(0.5);
        botonOpciones.setInteractive({ useHandCursor: true });

        botonOpciones.on('pointerover', () => {
            botonOpciones.setStyle({
                color: '#ffffff',
                backgroundColor: '#2274d7'
            });
        });

        botonOpciones.on('pointerout', () => {
                botonOpciones.setStyle({
                    color: '#000000',
                    backgroundColor: '#ffffff'
                });
            });

        //esto es para cuando has pulsado, aqui teneis q vincular vuestras escenas @marcos @victor
        botonOpciones.on('pointerdown', () => {
                console.log('Has pulsado OPCIONES');
            });


        
        //BOTON DE SALIR////////////

        let botonSalir = this.add.text(80, 450, 'SALIR', {
        fontSize: '30px',
        fontFamily: 'Isometra',
        color: '#000000',
        backgroundColor: '#d722bc',
        padding: { x: 30, y: 15 }
        });

        botonSalir.setOrigin(0.5);
        //botonSalir.setInteractive({ useHandCursor: true });
        botonSalir.setInteractive( new Phaser.Geom.Rectangle(0, 0, boton.width, boton.height),Phaser.Geom.Rectangle.Contains);

        botonSalir.on('pointerover', () => {
            botonSalir.setStyle({
                color: '#ffffff',
                backgroundColor: '#ed1170'
            });
        });

        botonSalir.on('pointerout', () => {
                botonSalir.setStyle({
                    color: '#000000',
                    backgroundColor: '#ffffff'
                });
            });

        //salir
        botonSalir.on('pointerdown', () => {
                //console.log('Has pulsado SALIR');
                this.scene.start('escena-prueba');

            });

        
        //BOTON DE CREDITOS////////////

        let botonCredits = this.add.text(785, 480, 'CREDITOS', {
        fontSize: '50px',
        fontFamily: 'Isometra',
        color: '#000000',
        backgroundColor: '#22bcd7',
        padding: { x: 30, y: 15 }
        });

        botonCredits.setOrigin(0.5);
        botonCredits.setInteractive({ useHandCursor: true });

        botonCredits.on('pointerover', () => {
            botonCredits.setStyle({
                color: '#ffffff',
                backgroundColor: '#000000'
            });
        });

        botonCredits.on('pointerout', () => {
                botonCredits.setStyle({
                    color: '#000000',
                    backgroundColor: '#ffffff'
                });
            });

        //salir
        botonCredits.on('pointerdown', () => {
                console.log('Has pulsado CREDITOS');
            });




    }

}