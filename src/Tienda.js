export default class Tienda extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'tienda' });
    }

    init(datos = {})
    {
        //guardo el tablero para usar los años de vida de la partida
        this.tablero = datos.tablero;

        //cada vez que entro en la tienda se puede hacer una compra
        this.compraHecha = false;
    }

    preload()
    {
        //fondo, personaje y los dos dados que se pueden comprar
        this.load.image('tienda-fondo', 'assets/shop/fondotienda.png');
        this.load.image('tienda-personaje', 'assets/shop/personajeTienda.png');
        this.load.image('tienda-izquierda', 'assets/shop/dadoIzq.png');
        this.load.image('tienda-derecha', 'assets/shop/DadoDer.png');
    }


    create()
    {
        //pongo la tienda por delante del tablero
        this.scene.bringToTop();
        this.cameras.main.setBackgroundColor('#241b18');

        const { width, height } = this.scale;

        //centro el fondo y hago que ocupe toda la pantalla del juego
        if (this.textures.exists('tienda-fondo'))
        {
            this.add.image(width / 2, height / 2, 'tienda-fondo')
                .setDisplaySize(width, height);
        }

        //botón volver abajo a la derecha
        const volver = this.add.text(width - 24, height - 20, 'VOLVER', {
            fontFamily: 'Isometra',
            fontSize: '20px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 12, y: 6 }
        }).setOrigin(1).setDepth(1).setInteractive({ useHandCursor: true });

        //reanudo el tablero que se quedó pausado al entrar y cierro la tienda
        volver.once('pointerdown', () => {
            if (this.tablero)
            {
                this.scene.resume(this.tablero.sys.settings.key);
            }

            this.scene.stop();
        });

        if (!this.tablero){
            return;
        } 

        //centro el personaje abajo y lo escalo para que quepa entero
        const personaje = this.add.image(width / 2, height - 12, 'tienda-personaje')
            .setOrigin(0.5, 1);
        personaje.setScale(Math.min(
            width * 0.95 / personaje.width,
            height * 0.88 / personaje.height
        ));

        this.crearIndicadorVida();

        //este texto se muestra si al jugador no le llegan los años
        this.mensaje = this.add.text(width / 2, height - 22, '', {
            fontFamily: 'Isometra',
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#241b18',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 1).setVisible(false);

        //posición de los dos objetos sobre las manos
        const alturaObjetos = height * 0.48;
        this.izquierda = this.crearObjeto(width * 0.22, alturaObjetos, 'tienda-izquierda');
        this.derecha = this.crearObjeto(width * 0.78, alturaObjetos, 'tienda-derecha');
    }

    crearIndicadorVida()
    {
        const tablero = this.tablero;

        //recuadro claro detrás del indicador, 320 es el ancho
        this.add.rectangle(20, 20, 320, 65, 0xf5e7d3).setOrigin(0);

        this.add.text(30, 30, 'ESPERANZA DE VIDA: ', {
            fontSize: '20px',
            fontFamily: 'Isometra',
            color: '#000000'
        });

        //muestro los años que tiene el jugador al abrir la tienda
        this.textoVida = this.add.text(235, 50, String(tablero.esperanzaVida), {
            fontSize: '25px',
            fontFamily: 'Isometra',
            color: '#fc3636'
        });

        //barra de fondo negra
        this.add.rectangle(30, 60, tablero.ANCHO_BARRA, tablero.ALTO_BARRA, 0x000000)
            .setOrigin(0);

        //la barra roja ocupa la parte de vida que le queda al jugador
        const ancho = tablero.ANCHO_BARRA * tablero.esperanzaVida / tablero.MAX_VIDA_PJ;
        this.barraVida = this.add.rectangle(30, 60, ancho, tablero.ALTO_BARRA, 0xff0000)
            .setOrigin(0);
    }

    crearObjeto(x, y, textura)
    {
        const precio = 30;

        //pongo el dado y lo escalo usando su lado más grande
        const imagen = this.add.image(x, y, textura);
        imagen.setScale(84 / Math.max(imagen.width, imagen.height));
        imagen.setInteractive({ useHandCursor: true });

        //pongo el precio debajo del dado
        const etiqueta = this.add.text(x, y + 48, `${precio} años`, {
            fontFamily: 'Isometra',
            fontSize: '20px',
            color: '#000000',
            backgroundColor: '#f5e7d3',
            padding: { x: 10, y: 4 }
        }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

        const objeto = { imagen, etiqueta, precio };

        //se puede comprar pulsando el dado o su precio
        //la flecha ( ()=> ) hace que la compra se intente al pulsar el dado
        imagen.on('pointerdown', () => this.comprar(objeto));
        etiqueta.on('pointerdown', () => this.comprar(objeto));

        return objeto;
    }

    comprar(objeto)
    {
        //si ya ha comprado un dado en esta visita no hago nada
        if (this.compraHecha) return;

        const tablero = this.tablero;

        //si no le llega la vida enseño el aviso y salgo antes de cobrar
        if (tablero.esperanzaVida < objeto.precio)
        {
            this.mensaje.setText('No tienes suficientes años de vida').setVisible(true);
            return;
        }

        //resto los años del tablero y guardo qué dado ha elegido
        this.compraHecha = true;
        tablero.esperanzaVida = tablero.esperanzaVida - objeto.precio;
        tablero.dadoComprado = objeto === this.izquierda ? 'izquierda' : 'derecha';

        const vida = String(tablero.esperanzaVida);
        const ancho = tablero.ANCHO_BARRA * tablero.esperanzaVida / tablero.MAX_VIDA_PJ;

        //actualizo el número y la barra en la tienda y en el tablero
        this.textoVida.setText(vida);
        this.barraVida.setSize(ancho, tablero.ALTO_BARRA);
        tablero.textoVida.setText(vida);
        tablero.barraVida.setSize(ancho, tablero.ALTO_BARRA);
        this.mensaje.setVisible(false);

        //quito los clics de los dos dados y sus precios
        this.izquierda.imagen.disableInteractive();
        this.izquierda.etiqueta.disableInteractive();
        this.derecha.imagen.disableInteractive();
        this.derecha.etiqueta.disableInteractive();

        //miro cuál es el otro dado para marcarlo como bloqueado
        const descartado = objeto === this.izquierda ? this.derecha : this.izquierda;
        objeto.etiqueta.setText('Comprado');
        descartado.etiqueta.setText('Bloqueado').setBackgroundColor('#b6b6b6');

        this.ponerEnGris(descartado.imagen);
    }

    ponerEnGris(imagen)
    {
        const claveGris = `${imagen.texture.key}-gris`;

        //creo la versión gris solo si todavía no está cargada
        if (!this.textures.exists(claveGris))
        {
            const original = imagen.texture.getSourceImage();
            const textura = this.textures.createCanvas(claveGris, original.width, original.height);
            const contexto = textura.getContext();

            contexto.filter = 'grayscale(100%)';
            contexto.drawImage(original, 0, 0);
            textura.refresh();
        }

        //hago desaparecer el dado y cuando termina el tween lo saco en gris
        this.tweens.add({
            targets: imagen,
            alpha: 0,
            duration: 120,
            onComplete: () => {
                imagen.setTexture(claveGris);
                this.tweens.add({
                    targets: imagen,
                    alpha: 0.65,
                    duration: 150
                });
            }
        });
    }
}