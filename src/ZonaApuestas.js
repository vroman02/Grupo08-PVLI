export default class ZonaApuestas extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'apuestas' });
    }

    init(datos = {})
    {
        //guardo el tablero para usar los años de vida de la partida
        this.tablero = datos.tablero;

    }

    preload()
    {
        this.load.image('muerte', 'assets/characters/Muerte.png');
        this.load.image('Pistola', 'assets/apuestas/Glock.png');
        this.load.image('Ruleta', 'assets/apuestas/Ruleta.png');
        this.load.spritesheet('fondo', 'assets/backgrounds/FondoMuerte.png', {
        frameWidth: 256,
        frameHeight: 256
        });
    }

    create()
    {
        //Creo a la muerte
        const muerte = this.add.image(this.scale.width/2, this.scale.height/2 + 30, 'muerte');
        muerte.setDisplaySize(550, 550);

        //Animacion del fondo
        this.anims.create({
        key: 'fondoanim',
        frames: this.anims.generateFrameNumbers('fondo', { start: 0, end: 4 }),
        frameRate: 8, 
        repeat: -1 
        });

        //Creo el fondo
        this.fondo = this.add.sprite(this.scale.width/2, this.scale.height/2, 'fondo');
        this.fondo.play('fondoanim');
        this.fondo.setDisplaySize(this.scale.width, this.scale.height);
        this.fondo.setDepth(-1);

        //Imagen de la ruleta (boton)
        const ruleta = this.add.image(175, this.scale.height/2 + 50, 'Ruleta')
        ruleta.setDisplaySize(300,300);
        ruleta.setInteractive({ useHandCursor: true });

        ruleta.on('pointerdown', () => {
            //Cargar escena ruleta
        });

         ruleta.on('pointerover', () => {
            ruleta.setDisplaySize(350, 350);
        });

         ruleta.on('pointerout', () => {
            ruleta.setDisplaySize(300, 300);
        });

        //Imagen de ruleta rusa (boton)
        const ruletarusa = this.add.image(800, this.scale.height/2 + 50, 'Pistola')
        ruletarusa.setDisplaySize(300,200);
        ruletarusa.setInteractive({ useHandCursor: true });
        

        ruletarusa.on('pointerdown', () => {
            //Cargar escena ruleta rusa
        });

         ruletarusa.on('pointerover', () => {
            ruletarusa.setDisplaySize(350, 250);
        });

         ruletarusa.on('pointerout', () => {
            ruletarusa.setDisplaySize(300, 200);
        });

        //botón volver
        const volver = this.add.text(this.scale.width - 24, this.scale.height - 20, 'VOLVER', {
            fontFamily: 'Isometra',
            fontSize: '20px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 12, y: 6 }
        }).setOrigin(1).setDepth(1).setInteractive({ useHandCursor: true });

        //reanudo el tablero que se quedó pausado al entrar
        volver.once('pointerdown', () => {
            if (this.tablero)
            {
                this.scene.resume(this.tablero.sys.settings.key);
            }

            this.scene.stop();
        });

        this.crearIndicadorVida()
    }

    crearIndicadorVida()
    {
        const tablero = this.tablero;

        this.add.text(30, 30, 'ESPERANZA DE VIDA: ', {
            fontSize: '20px',
            fontFamily: 'Isometra',
            color: '#ffffff'
        });

        //muestro los años que tiene el jugador al abrir la tienda
        this.textoVida = this.add.text(235, 50, String(tablero.esperanzaVida), {
            fontSize: '25px',
            fontFamily: 'Isometra',
            color: '#fc3636'
        });

        //barra de fondo negra
        this.add.rectangle(30, 60, tablero.ANCHO_BARRA, tablero.ALTO_BARRA, 0x000000).setOrigin(0);

        //la barra roja ocupa la parte de vida que le queda al jugador
        const ancho = tablero.ANCHO_BARRA * tablero.esperanzaVida / tablero.MAX_VIDA_PJ;
        this.barraVida = this.add.rectangle(30, 60, ancho, tablero.ALTO_BARRA, 0xff0000).setOrigin(0);
    }
}