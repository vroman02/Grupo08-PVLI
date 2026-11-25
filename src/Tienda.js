
import OBJETOS_TIENDA from "./ObjetosTienda.js";

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
        //fondo y personaje de la tienda
        this.load.image('tienda-fondo', 'assets/shop/fondotienda.png');
        this.load.image('tienda-personaje', 'assets/shop/personajeTienda.png');

        //imágenes de los objetos
        this.load.image('tienda-izquierda', 'assets/shop/dadoIzq.png');
        this.load.image('tienda-derecha', 'assets/shop/DadoDer.png');

        //cargo todos los fotogramas de la moneda
        for (let i = 1; i <= 6; i++)
        {
            this.load.image('goldcoin-' + i, 'assets/coin/goldcoin-' + i + '.png');
        }

        //y las 2 caras d la moneda
        this.load.image('goldcoin-heads', 'assets/coin/goldcoin-heads.png');
        this.load.image('goldcoin-tails', 'assets/coin/goldcoin-tails.png');

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

        if (!this.tablero)
        {
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

        //elijo dos objetos aleatorios del catálogo
        const objetos = this.elegirObjetos();

        //posición de los dos objetos sobre las manos
        const alturaObjetos = height * 0.48;

        this.izquierda = this.crearObjeto(
            width * 0.22,
            alturaObjetos,
            objetos[0]
        );

        this.derecha = this.crearObjeto(
            width * 0.78,
            alturaObjetos,
            objetos[1]
        );

                //animación de la moneda
        if (!this.anims.exists('girar-moneda'))
        {
            this.anims.create({
                key: 'girar-moneda',
                frames: [
                    { key: 'goldcoin-1' },
                    { key: 'goldcoin-2' },
                    { key: 'goldcoin-3' },
                    { key: 'goldcoin-4' },
                    { key: 'goldcoin-5' },
                    { key: 'goldcoin-6' }
                ],
                frameRate: 12,
                repeat: 3
            });
        }


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
        this.add.rectangle(
            30, 60,
            tablero.ANCHO_BARRA,
            tablero.ALTO_BARRA,
            0x000000
        ).setOrigin(0);

        //la barra roja ocupa la parte de vida que le queda al jugador
        const ancho = tablero.ANCHO_BARRA * tablero.esperanzaVida / tablero.MAX_VIDA_PJ;

        this.barraVida = this.add.rectangle(
            30, 60,
            ancho,
            tablero.ALTO_BARRA,
            0xff0000
        ).setOrigin(0);
    }

    crearObjeto(x, y, datos)
    {
        const precio = datos.precio;

        //pongo el objeto y ajusto su tamaño
        let textura = datos.textura;

        //uso una imagen provisional si todavía no he cargado la textura
        if (!this.textures.exists(textura))
        {
            textura = 'tienda-izquierda';
        }

        const imagen = this.add.image(x, y, textura);
        imagen.setScale(84 / Math.max(imagen.width, imagen.height));
        imagen.setInteractive({ useHandCursor: true });

        //cambio el color del objeto al pasar el ratón
        imagen.on('pointerover', () => {
            if (!this.compraHecha)
            {
                imagen.setTint(0xffcc00);
            }
        });

        imagen.on('pointerout', () => {
            imagen.clearTint();
        });


        //hago que los objetos floten un poco 
        this.tweens.add({
            targets: imagen,
            y: imagen.y - 8,
            duration: 1200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        //pongo el precio debajo del objeto
        const etiqueta = this.add.text(x, y + 48, `${precio} años`, {
            fontFamily: 'Isometra',
            fontSize: '20px',
            color: '#000000',
            backgroundColor: '#f5e7d3',
            padding: { x: 10, y: 4 }
        }).setOrigin(0.5, 0);


        //guardo los datos del objeto junto a su imagen y etiqueta
        const objeto = {
            ...datos,
            imagen,
            etiqueta
        };

        //compro pulsando el objeto
        imagen.on('pointerdown', () => this.comprar(objeto));

        return objeto;
    }

    comprar(objeto)
    {
        //si ya he comprado un objeto no hago nada
        if (this.compraHecha) return;

        const tablero = this.tablero;

        //compruebo si tengo suficiente vida
        if (tablero.esperanzaVida < objeto.precio)
        {
            this.mensaje.setText('No tienes suficientes años de vida').setVisible(true);
            return;
        }

        //resto los años del tablero
        this.compraHecha = true;
        tablero.esperanzaVida = tablero.esperanzaVida - objeto.precio;

        //compruebo qué objeto he comprado
        let descartado;

        if (objeto == this.izquierda)
        {
            descartado = this.derecha;
        }
        else
        {
            descartado = this.izquierda;
        }

        //mantengo la referencia al dado comprado si es un dado
        if (objeto.tipo == 'dado')
        {
            if (objeto.id == 'dado-blanco')
            {
                tablero.dadoComprado = 'izquierda';
            }
            else if (objeto.id == 'dado-rojo')
            {
                tablero.dadoComprado = 'derecha';
            }
        }

        //guardo el objeto en el inventario con sus propiedades
        tablero.inventario.agregarObjeto({
            id: objeto.id,
            nombre: objeto.nombre,
            tipo: objeto.tipo,
            textura: objeto.textura,
            efecto: objeto.efecto,
            cantidad: objeto.cantidad
        });

        const vida = String(tablero.esperanzaVida);
        const ancho = tablero.ANCHO_BARRA * tablero.esperanzaVida / tablero.MAX_VIDA_PJ;

        //actualizo la vida en la tienda y el tablero
        this.textoVida.setText(vida);
        this.barraVida.setSize(ancho, tablero.ALTO_BARRA);
        tablero.textoVida.setText(vida);
        tablero.barraVida.setSize(ancho, tablero.ALTO_BARRA);
        this.mensaje.setVisible(false);

        //desactivo los objetos después de comprar
        this.izquierda.imagen.disableInteractive();
        this.izquierda.etiqueta.disableInteractive();
        this.derecha.imagen.disableInteractive();
        this.derecha.etiqueta.disableInteractive();

        //marco el objeto comprado y bloqueo el otro
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
            const textura = this.textures.createCanvas(
                claveGris,
                original.width,
                original.height
            );

            const contexto = textura.getContext();

            contexto.filter = 'grayscale(100%)';
            contexto.drawImage(original, 0, 0);
            textura.refresh();
        }

        //hago desaparecer el objeto y cuando termina lo saco en gris
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


    //elijo 2 objetos aleatorios sin repetir
    elegirObjetos()
    {
        //m copio el array para no modificar el original (los 3 ...)
        const disponibles = [...OBJETOS_TIENDA];

        //esto del phaser mezcla los objetos del array
        Phaser.Utils.Array.Shuffle(disponibles);

        //devuelvo las posiciones 0 y 1 del array (las 2 primeras)
        return disponibles.slice(0, 2);
    }






















}
