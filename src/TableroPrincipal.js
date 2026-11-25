
import Inventario from "./Inventario.js";

export default class TableroPrincipal extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'tablero-principal' });
    }

    preload()
    {
        //Imagen personaje
        this.load.image('personaje-lateral', 'assets/characters/PersonajeLateral.png');

        //fuente ISOMETRA
        this.loadFont('Isometra', 'assets/fonts/Isometra-Regular.ttf');

        //caras dado
        this.load.image('dado1', 'assets/dice/1.png');
        this.load.image('dado2', 'assets/dice/2.png');
        this.load.image('dado3', 'assets/dice/3.png');
        this.load.image('dado4', 'assets/dice/4.png');
        this.load.image('dado5', 'assets/dice/5.png');
        this.load.image('dado6', 'assets/dice/6.png');

        //imagen moneda
        this.load.image('moneda-destino', 'assets/coin/goldcoin-1.png');
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
        this.cameras.main.setBackgroundColor('#99c9f0');

        //Tablero de casillas//////////////

        //tamaño d las casillas
        const tamano = 80;
        //distancia entre ellas
        const separacion = 10;

        //coordenadas desde donde se empieza a construir el tablero
        const inicioX = 80;
        const inicioY = 270;

        //cada tipo es un color 0 blanco, 1 verde, 2 rojo , 3 casilla final (lógicamente solo puede haber una y al final)
        this.casillas = [0, 0, 1, 0, 2, 0, 2, 2, 1, 3];

        //los pongo en hexadecimal porque si no sale en negro
        const colores = [
            0xffffff, //normal (no hace nada) blanco
            0x00ff00, //minijuego verde
            0xff0000, //negativa roja
            0xffff00 //casilla final amarilla
        ];

        //genero el tablero con casillas de diferentes tipos y colores
        this.casillas.forEach((tipo, i) => {

            this.casillas[i] = {
                tipo: tipo,
                rectangle: this.add.rectangle(
                    inicioX + i * (tamano + separacion),
                    inicioY,
                    tamano,
                    tamano,
                    colores[tipo]
                )
            };

        });

        //DADO //////////////
        this.dado = this.add.image(480, 120, 'dado1');
        this.dado.setDisplaySize(90, 90);

        this.tirandoDado = false;

        //PERSONAJE
        this.MAX_VIDA_PJ = 100;
        this.personaje = this.add.image(inicioX, inicioY, 'personaje-lateral');
        this.personaje.setDisplaySize(80, 80);
        this.personaje.setDepth(1); //para que se dibuje por delante del tablero

        //posición actual del jugador en el tablero
        this.posicionJugador = 0;
        //los años restantes de vida del jugador
        this.esperanzaVida = this.MAX_VIDA_PJ;

        //creo el inventario del jugador
        this.inventario = new Inventario();

        //PRUEBAAAA OBJETOOOOOSSS
        //this.inventario.agregarObjeto({ nombre: 'monedaaaa' });
        //this.inventario.agregarObjeto({ nombre: 'pocionnn' });

        //texto esperanza de vida
        this.add.text(30, 30, 'ESPERANZA DE VIDA: ', {
            fontSize: '20px',
            fontFamily: 'Isometra',
            color: '#000000'
        });

        /*
        //texto años
        this.add.text(295, 60, 'años: ', {
            fontSize: '15px',
            fontFamily: 'Isometra',
            color: '#000000'
        }); */

        //variable a mostar de la vida
        this.textoVida = this.add.text(235, 50, this.esperanzaVida, {
            fontSize: '25px',
            fontFamily: 'Isometra',
            color: '#fc3636'
        });

        //BARRA DE VIDA (VISUAL)

        this.ANCHO_BARRA = 200;
        this.ALTO_BARRA = 15;

        //barra de fondo negra
        this.barraFondo = this.add.rectangle(
            30, 60,
            this.ANCHO_BARRA,
            this.ALTO_BARRA,
            0x000000
        );

        this.barraFondo.setOrigin(0, 0);

        //barra de vida roja
        this.barraVida = this.add.rectangle(
            30, 60,
            this.ANCHO_BARRA,
            this.ALTO_BARRA,
            0xff0000
        );

        this.barraVida.setOrigin(0, 0);

        //resalto la casilla en la q esta el jugador para que sea más visual (lo pongo aqui otra vez porque si no la casilla incial no la detecta)
        this.resaltarCasilla();

        //botón tirar dados
        const botonDados = this.add.text(930, 30, 'TIRAR DADO', {
            fontSize: '25px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        botonDados.setOrigin(1, 0);
        botonDados.setInteractive({ useHandCursor: true });

        botonDados.on('pointerdown', () => {
            //llamo a tirar dado
            this.tirarDado();
        });

        botonDados.on('pointerover', () => {
            botonDados.setStyle({
                color: '#000000',
                backgroundColor: '#83e5ee'
            });
        });

        botonDados.on('pointerout', () => {
            botonDados.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        //Boton volver
        const boton = this.add.text(900, 500, 'VOLVER', {
            fontSize: '10px',
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
            this.scene.start('menu-principal');
        });

        //boton apuestas
        const botonApuestas = this.add.text(150, 500, 'Apuestas', {
            fontSize: '10px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        botonApuestas.setOrigin(0.5);
        botonApuestas.setInteractive({ useHandCursor: true });

        botonApuestas.on('pointerover', () => {
            botonApuestas.setStyle({
                color: '#ffffff',
                backgroundColor: '#ff0000'
            });
        });

        botonApuestas.on('pointerout', () => {
            botonApuestas.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        botonApuestas.on('pointerdown', () => {
            this.cerrarInventario();
            this.scene.launch('apuestas', { tablero: this });
            this.scene.pause();
        });

        //boton tienda
        const botonTienda = this.add.text(60, 500, 'TIENDA', {
            fontSize: '10px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        botonTienda.setOrigin(0.5);
        botonTienda.setInteractive({ useHandCursor: true });

        botonTienda.on('pointerover', () => {
            botonTienda.setStyle({
                color: '#000000',
                backgroundColor: '#2274d7'
            });
        });

        botonTienda.on('pointerout', () => {
            botonTienda.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        botonTienda.on('pointerdown', () => {
            this.cerrarInventario();
            this.scene.launch('tienda', { tablero: this });
            this.scene.pause();
        });

        //botón del inventario (mochila)
        const botonInventario = this.add.text(250, 500, 'MOCHILA', {
            fontSize: '10px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        botonInventario.setOrigin(0.5);
        botonInventario.setInteractive({ useHandCursor: true });

        botonInventario.on('pointerover', () => {
            botonInventario.setStyle({
                color: '#000000',
                backgroundColor: '#ffcc00'
            });
        });

        botonInventario.on('pointerout', () => {
            botonInventario.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        botonInventario.on('pointerdown', () => {
            this.mostrarInventario();
        });
    }

    comprobarCasillaJugador(tipo)
    {
        const PERDIDA_VIDA_ROJA = 30;

        //si la casilla en la que esta no es blanca hacemos cosas
        if (tipo != 0)
        {
            if (tipo == 1) //verde minijuego
            {
                let numAleatorio = Phaser.Math.Between(0, 2);
                console.log("SE METIO EN UN MINIJUEGO", numAleatorio);
                //TEMPORAL, CARGAR EL MINIJUEGO DEL PROFESOR
                this.scene.start('profesor-minigame');

                /*
                switch (numAleatorio)
                {
                    //minijuego pesca
                    case 0:
                        this.scene.start('pesca-minigame');
                        break;
                    //minijuego bomba
                    case 1:
                        this.scene.start('bomba-minigame');
                        break;
                    //mini pintura
                    case 2:
                        this.scene.start('limpieza-minigame');
                        break;

                    default:
                        console.log("TIPO DE CASILLA DESCONOCIDO");
                        break;
                }
                */
            }
            else if (tipo == 2) //roja quitar vida
            {
                this.esperanzaVida -= PERDIDA_VIDA_ROJA;
                this.esperanzaVida = Math.max(0, this.esperanzaVida);
                //actualizo el contador visible
                this.textoVida.setText(this.esperanzaVida);

                this.barraVida.setSize(
                    this.ANCHO_BARRA * (this.esperanzaVida / this.MAX_VIDA_PJ),
                    this.ALTO_BARRA
                );

                console.log("perdioVida");
            }
            else if (tipo == 3)
            {
                console.log("GANOOOOOOOOOOO");
                this.scene.start('escena-manolo');
            }
        }
    }

    tirarDado()
    {
        //si ya estamos tirando el dado no hace nada
        if (this.tirandoDado) return;

        this.tirandoDado = true;

        //genero un número aleatorio del 1 al 6
        const resultado = Phaser.Math.Between(1, 6);

        //numero máximo de cambios de cara
        const NUM_CAMBIOS_CARA = 20;
        let cambios = 0;

        //creo un obnjeto con la propiedad d progreso que irá incrementando de 0 a 12 en 2s (2000ms)
        const animacion = { progreso: 0 };

        this.tweens.add({
            targets: animacion,
            progreso: NUM_CAMBIOS_CARA,
            duration: 2000,
            ease: 'Linear',

            //mientras se esta ejecuntando el tween cambio las caras del dado
            onUpdate: () => {
                const nuevoCambio = Math.floor(animacion.progreso);

                if (nuevoCambio > cambios)// && cambios < NUM_CAMBIOS_CARA)
                {
                    cambios = nuevoCambio;
                    this.dado.setTexture('dado' + Phaser.Math.Between(1, 6));
                }
            },

            //cuando termina el tween ejecuto la logica
            onComplete: () => {

                this.dado.setTexture('dado' + resultado);
                this.dado.rotation = 0;

                //modifico la posición del jugador
                this.posicionJugador = this.posicionJugador + resultado;

                //hago que no se pueda salir de la última casilla
                this.posicionJugador = Math.min(this.posicionJugador, this.casillas.length - 1);

                //cambio su posición en el tablero
                this.personaje.setPosition(
                    this.casillas[this.posicionJugador].rectangle.x,
                    this.casillas[this.posicionJugador].rectangle.y
                );

                //resalto la casilla en la q esta el jugador para que sea más visual
                this.resaltarCasilla();

                //llamo a comprobarCasilla() para ver si hay algo que hacer en caso que la casilla sea verde, roja o amarilla.
                this.comprobarCasillaJugador(this.casillas[this.posicionJugador].tipo);

                this.tirandoDado = false;

                console.log('Dado:', resultado);
                console.log('Posición jugador:', this.posicionJugador);
            }
        });

        //hago que gire el dado
        this.tweens.add({
            targets: this.dado,
            rotation: Math.PI * 4,
            duration: 2000,
            ease: 'Cubic.easeOut'
        });
    }

    resaltarCasilla()
    {
        //detener el tween anterior si existe
        if (this.tweenCasilla)
        {
            this.tweenCasilla.stop();
        }

        //recupero el aspecto original de todas las casillas (cambiando su alpha que es lo único que modifica el tween)
        this.casillas.forEach(casilla => {
            casilla.rectangle.setAlpha(1);
        });

        //miro cual es  la casilla actual
        const casillaActual = this.casillas[this.posicionJugador].rectangle;

        //pongo el efecto de parpadeo
        this.tweenCasilla = this.tweens.add({
            targets: casillaActual,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    mostrarInventario()
    {
        //cierro la mochila si ya está abierta
        if (this.panelInventario)
        {
            this.panelInventario.destroy();
            this.panelInventario = null;
            return;
        }

        //creo el panel d la mochila
        this.panelInventario = this.add.container(480, 270);
        this.panelInventario.setDepth(10);

        const fondo = this.add.rectangle(0, 0, 500, 350, 0x241b18);
        fondo.setStrokeStyle(3, 0xffffff);

        const titulo = this.add.text(0, -145, 'INVENTARIO', {
            fontSize: '28px',
            fontFamily: 'Isometra',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.panelInventario.add([fondo, titulo]);

        //muestro los objetos que tengo
        const objetos = this.inventario.obtenerObjetos();

        if (objetos.length === 0)
        {
            const vacio = this.add.text(0, 0, 'Inventario vacío', {
                fontSize: '22px',
                fontFamily: 'Isometra',
                color: '#ffffff'
            }).setOrigin(0.5);

            this.panelInventario.add(vacio);
        }
        else
        {
            objetos.forEach((objeto, indice) => {

                //calculo la posición del objeto
                const x = -150 + indice * 150;
                const y = -20;

                //muestro la imagen del objeto
                const imagen = this.add.image(x, y, objeto.textura);
                imagen.setScale(55 / Math.max(imagen.width, imagen.height));

                //permito utilizar el objeto al pulsarlo
                imagen.setInteractive({ useHandCursor: true });

                imagen.on('pointerdown', () => {
                    this.usarObjeto(objeto, indice);
                });

                //pongo el nombre debajo de la imagen
                const texto = this.add.text(x, y + 38, objeto.nombre, {
                    fontSize: '12px',
                    fontFamily: 'Isometra',
                    color: '#ffffff'
                }).setOrigin(0.5);

                this.panelInventario.add([imagen, texto]);
            });
        }
    }

    //cierro la mochila si está abierta
    //esto es porque si no al cambiar d escena se quedaba abierto y sina actualizarse
    cerrarInventario()
    {
        if (this.panelInventario)
        {
            this.panelInventario.destroy();
            this.panelInventario = null;
        }
    }

    //utilizo un objeto del inventario
    usarObjeto(objeto, indice)
    {
        //compruebo qué efecto tiene el objeto
        if (objeto.efecto == 'moneda')
        {
            this.lanzarMoneda(objeto, indice);
        }

        //aquiiii hay q ir metiendo el resto segun se vayan creando
        //@todos
    }

    //lanzo la moneda y aplico su efecto
    lanzarMoneda(objeto, indice)
    {
        //evito lanzar varias monedas a la vez
        if (this.monedaGirando)
        {
            return;
        }

        this.monedaGirando = true;

        //elijo aleatoriamente si sale cara o cruz
        const resultadoMoneda = Phaser.Math.Between(1, 2);

        //cierro la mochila
        this.cerrarInventario();

        //oscurezco el tablero mientras gira la moneda
        const fondo = this.add.rectangle(
            480, 270, 960, 540, 0x000000, 0.65
        ).setDepth(20).setInteractive();

        //creo la moneda en el centro de la pantalla
        const moneda = this.add.sprite(480, 240, 'goldcoin-1');
        moneda.setScale(3);
        moneda.setDepth(21);

        //reproduzco la animación
        moneda.play('girar-moneda');

        //cuando termina el giro muestro el resultado
        moneda.once('animationcomplete', () => {

            let cantidad = objeto.cantidad;
            let resultado;
            let color;

            if (resultadoMoneda == 1)
            {
                //cara, gano años
                moneda.setTexture('goldcoin-heads');
                resultado = 'CARA: +' + cantidad + ' AÑOS';
                color = '#108510';
            }
            else
            {
                //cruz, pierdo años
                moneda.setTexture('goldcoin-tails');
                cantidad = -cantidad;
                resultado = 'CRUZ: ' + cantidad + ' AÑOS';
                color = '#ff4444';
            }

            //la vida siempre queda entre 0 y 100
            this.esperanzaVida = Phaser.Math.Clamp(
                this.esperanzaVida + cantidad,
                0,
                this.MAX_VIDA_PJ
            );

            this.textoVida.setText(String(this.esperanzaVida));

            const ancho = this.ANCHO_BARRA * this.esperanzaVida / this.MAX_VIDA_PJ;
            this.barraVida.setSize(ancho, this.ALTO_BARRA);

            //elimino la moneda utilizada del inventario
            this.inventario.eliminarObjeto(indice);

            //muestro el resultado debajo de la moneda
            const texto = this.add.text(480, 370, resultado, {
                fontFamily: 'Isometra',
                fontSize: '28px',
                color: color
            }).setOrigin(0.5).setDepth(21);

            //espero 1,5 segundos antes de quitar la animación
            this.time.delayedCall(1500, () => {
                moneda.destroy();
                texto.destroy();
                fondo.destroy();

                this.monedaGirando = false;
            });
        });
    }
}
