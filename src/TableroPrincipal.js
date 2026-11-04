
export default class TableroPrincipal extends Phaser.Scene 
{
    constructor() 
    {
        super({ key: 'tablero-principal' });
    }

    preload(){

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
        const botonDados = this.add.text(480, 450, 'TIRAR DADO', {
            fontSize: '25px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });


        botonDados.setOrigin(0.5);
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
    }



    comprobarCasillaJugador(tipo)
    {
        const PERDIDA_VIDA_ROJA = 30;

        //si la casilla en la que esta no es blanca hacemos cosas
        if(tipo != 0)
        {

            if (tipo == 1) //verde minijuego
            {
                let numAleatorio = Phaser.Math.Between(0, 2);
                console.log("SE METIO EN UN MINIJUEGO", numAleatorio);

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


                this.barraVida.setSize(this.ANCHO_BARRA * (this.esperanzaVida / this.MAX_VIDA_PJ), this.ALTO_BARRA);





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
                this.personaje.setPosition( this.casillas[this.posicionJugador].rectangle.x, this.casillas[this.posicionJugador].rectangle.y);

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










}
