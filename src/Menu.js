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

        //BACKGROUNDS (Tableros del Mario Party)
        this.load.image('tablero-infierno', 'assets/backgrounds/TableroPlaceholderInfierno.jpeg');
        this.load.image('tablero-normal', 'assets/backgrounds/TableroPlaceholderNormal.jpg');

        //CHARACTERS (Goku en nube quedaba bonico)
        this.load.image('personaje-principal', 'assets/characters/PlaceholderPersonajePrincipal.png');
        
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
            mostrarPanel(true);
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


    //BOTON DE Selector de minijuegos////////////
        let botonSelector = this.add.text(810, 60, 'MINIJUEGOS', {
        fontSize: '30px',
        fontFamily: 'Isometra',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: { x: 20, y: 12 }
        });

        botonSelector.setOrigin(0.5);
        botonSelector.setInteractive({ useHandCursor: true });

        botonSelector.on('pointerover', () => {
            botonSelector.setStyle({
                color: '#ffffff',
                backgroundColor: '#2274d7'
            });
        });

        botonSelector.on('pointerout', () => {
            botonSelector.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        botonSelector.on('pointerdown', () => {
            this.scene.start('selector-minigames');
        });


        //PANEL DE JUGAR (selector de escenas)////////////
        //Todo lo del panel va en este array para mostrarlo/ocultarlo de golpe
        const panelObjs = [];

        const mostrarPanel = (visible) => {
            panelObjs.forEach(o => o.setVisible(visible));
        };

        //Fondo del panel (tambien bloquea los clics a los botones de debajo)
        const fondoPanel = this.add.rectangle(480, 270, 960, 540, 0xfae06e);
        fondoPanel.setInteractive();
        panelObjs.push(fondoPanel);

        const tituloPanel = this.add.text(480, 60, 'ELIGE ESCENA', {
            fontFamily: 'Isometra',
            fontSize: '40px',
            color: '#000000'
        }).setOrigin(0.5);
        panelObjs.push(tituloPanel);

        const crearBotonPanel = (x, y, texto, accion) => {
            const b = this.add.text(x, y, texto, {
                fontFamily: 'Isometra',
                fontSize: '20px',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: { x: 30, y: 15 }
            });

            b.setOrigin(0.5);
            b.setInteractive({ useHandCursor: true });

            b.on('pointerover', () => {
                b.setStyle({ color: '#ffffff', backgroundColor: '#2274d7' });
            });

            b.on('pointerout', () => {
                b.setStyle({ color: '#000000', backgroundColor: '#ffffff' });
            });

            b.on('pointerdown', accion);
            panelObjs.push(b);
        };

        crearBotonPanel(480, 200, 'PRUEBA', () => {
            this.scene.start('escena-manolo');
        });

        crearBotonPanel(480, 300, 'TABLERO NORMAL', () => {
            this.scene.start('tablero-juego-normal');
        });

        crearBotonPanel(480, 400, 'TABLERO INFIERNO', () => {
            this.scene.start('tablero-infierno');
        });

        crearBotonPanel(850, 500, 'VOLVER', () => {
            mostrarPanel(false);
        });

        //El panel va por encima de todo y empieza oculto
        panelObjs.forEach(o => o.setDepth(10));
        mostrarPanel(false);

    }

}