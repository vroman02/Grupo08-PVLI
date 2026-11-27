//PISTAS: Map <pista, cable>. La pista indica el cable que NO se debe cortar: si se corta, explota y sale el comic
//Se escoge una al azar al empezar. Hay 3 pistas por cable. Ambientacion: eres un agente de inteligencia
//japones dentro de un edificio de Shibuya (Tokio)
const PISTAS = new Map([
    //Rojo
    ['El circulo en el centro de la bandera de tu pais', 'rojo'],
    ['El color del extintor que cuelga en el pasillo del edificio', 'rojo'],
    ['El color de la tinta del sello hanko con el que firmas los documentos', 'rojo'],

    //Amarillo
    ['El color de la cinta con la que la policia acordona una zona peligrosa', 'amarillo'],
    ['El color de las notas adhesivas pegadas en tu monitor', 'amarillo'],
    ['El color de la luz del semaforo que avisa de que va a cambiar', 'amarillo'],

    //Verde
    ['El color del hombrecillo que corre en el cartel de salida de emergencia', 'verde'],
    ['El color del te matcha que te sirven en las reuniones', 'verde'],
    ['El color del wasabi que lleva el sushi', 'verde'],

    //Azul
    ['El color del uniforme de la policia japonesa', 'azul'],
    ['El color de los planos del edificio que estudiaste', 'azul'],
    ['El color del mar que rodea el pais que proteges', 'azul']
]);

//TIEMPO para desactivar la bomba, en SEGUNDOS (empieza a contar cuando baja la pista). En modo Infierno deberia ser menor
const TIEMPO_TOTAL = 30;

export default class Bomba_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'bomba-minigame' });
        }


     preload()
    {
        this.load.image('Nuke', 'assets/minigames/Bomba/Nuke.png');
        this.load.image('mesa', 'assets/minigames/Bomba/Mesa_Herramientas.png');

        //Sprite sheet de los cables (columna izquierda = entero, columna derecha = cortado)
        this.load.image('cables', 'assets/minigames/Bomba/sprite_sheet.png');

        //Papel con la pista
        this.load.image('pista', 'assets/minigames/Bomba/PistasBomba.png');

        //Sprite sheet de las tijeras (frame 1 = abiertas, frame 2 = cerradas)
        this.load.image('tijeras', 'assets/minigames/Bomba/sprite_sheetTijera.png');

        //Paginas de manga de la derrota
        this.load.image('manga1', 'assets/minigames/Bomba/Pagina1Comienzo.jpg');
        this.load.image('manga2', 'assets/minigames/Bomba/Pagina2Explosion.jpg');
    }

    create(){

        //Tamaño real del canvas (800x600 en horizontal) -> todo se calcula relative a esto
        const W = this.scale.width;
        const H = this.scale.height;

        const fondo = this.add.image(W / 2, H / 2, 'mesa');
        fondo.setDisplaySize(W, H);
        fondo.setDepth(0);
        
        //Imagen de la bomba -> MAS GRANDE y en el CENTRO de la escena
        const BOMBA_W = 960;
        const BOMBA_H = 720;
        const bomba = this.add.image(W / 2, H / 2, 'Nuke');
        bomba.setDisplaySize(BOMBA_W, BOMBA_H);
        bomba.setDepth(1);

        //CABLES. Buscado en google el como hacer el array para los cables
        //x1/x2/y/w/h = recorte REAL del sprite sheet (NO tocar: si se cambian, el frame sale transparente)
        //nx/ny = esquina INFERIOR-IZQUIERDA del cable sobre la imagen de la bomba (800x600), medida del PNG de referencia
        //        (ahi los cables ya estan separados). Cambiando nx/ny se mueve/separa cada cable
        const ESCALA = bomba.scaleX;         //los cables van a la misma escala que la bomba
        const cablesData = [
            { color: 'rojo',     x1: 305, x2: 1105, y: 236,  w: 116, h: 76, nx: 305, ny: 312 },
            { color: 'amarillo', x1: 293, x2: 1093, y: 837,  w: 127, h: 85, nx: 293, ny: 322 },
            { color: 'verde',    x1: 281, x2: 1081, y: 1437, w: 140, h: 97, nx: 281, ny: 334 },
            { color: 'azul',     x1: 281, x2: 1081, y: 2120, w: 137, h: 30, nx: 281, ny: 350 }
        ];

        //Esquina superior-izquierda de la imagen de la bomba en pantalla
        const bombaX0 = bomba.x - BOMBA_W / 2;
        const bombaY0 = bomba.y - BOMBA_H / 2;

        const texCables = this.textures.get('cables');

        //Para ganar hay que cortar TODOS los cables menos el de la pista
        let cortesSeguros = 0;
        const totalSeguros = cablesData.length - 1;
 
        for (let i = 0; i < cablesData.length; i++) {
            const c = cablesData[i];
 
            //Registramos los frames (estado 1 y estado 2) del cable
            texCables.add(c.color + '_1', 0, c.x1, c.y, c.w, c.h);
            texCables.add(c.color + '_2', 0, c.x2, c.y, c.w, c.h);
 
            const cable = this.add.image(bombaX0 + c.nx * ESCALA, bombaY0 + c.ny * ESCALA, 'cables', c.color + '_1');
            cable.setOrigin(0, 1);           //ancla en el vertice inf-izq de la L -> permite anidarlas
            cable.setScale(ESCALA);
            cable.setDepth(2);               //por DELANTE de la bomba
            cable.setData('color', c.color);
            cable.setData('cortado', false);
 
            //pixelPerfect: solo reacciona al click sobre el cable y no sobre el hueco transparente
            cable.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
 
            //Si click izquierdo cambia de estado a cortado
            cable.on('pointerdown', (pointer) => {
                if (!pointer.leftButtonDown()) return;
                if (!this.juegoActivo) return;      //mientras se ve la pista no se puede cortar
                if (cable.getData('cortado')) return;
 
                cable.setFrame(c.color + '_2');
                cable.setData('cortado', true);
                cable.disableInteractive();

                //Si se corta el cable asociado a la pista en el Map, la bomba explota y sale el comic
                //Cualquier otro cable es seguro: se gana al cortar todos los seguros
                if (c.color === this.cableCorrecto) {
                    this.perder();
                } else {
                    cortesSeguros++;
                    if (cortesSeguros === totalSeguros) {
                        this.ganar();
                    }
                }
            });
        }

        //Hasta que baje la pista no se puede empezar a jugar
        this.juegoActivo = false;
        this.perdido = false;

        //TIMER en la pantalla verde de la bomba (PANTALLA = medida sobre la imagen de 800x600: x 329-419, y 240-290)
        this.tiempoRestante = TIEMPO_TOTAL;
        const PANTALLA = { x: 329, y: 240, w: 91, h: 51 };
        const timerX = bombaX0 + (PANTALLA.x + PANTALLA.w / 2) * ESCALA;
        const timerY = bombaY0 + (PANTALLA.y + PANTALLA.h / 2) * ESCALA;

        this.textoTimer = this.add.text(timerX, timerY, this.formatoTiempo(this.tiempoRestante), {
            fontFamily: 'Isometra',
            fontSize: '34px',
            color: '#2a2a10'
        });
        this.textoTimer.setOrigin(0.5);
        this.textoTimer.setDepth(2);

        //Se reduce la letra hasta que quepa dentro de la pantalla
        let tamTimer = 34;
        while ((this.textoTimer.width > PANTALLA.w * ESCALA * 0.85 || this.textoTimer.height > PANTALLA.h * ESCALA * 0.85) && tamTimer > 10) {
            tamTimer--;
            this.textoTimer.setFontSize(tamTimer);
        }

        //Se escoge una pista al azar: GetRandom devuelve una pareja [pista, cable]
        const [textoPista, cableCorrecto] = Phaser.Utils.Array.GetRandom([...PISTAS]);
        this.cableCorrecto = cableCorrecto;

        //Pista: al empezar se ve en el centro. Con ENTER baja en linea recta (sin aceleracion)
        //Va pegada al borde INFERIOR de la pantalla (los brazos salen por abajo) como en el boceto
        const ESCALA_PAPEL = 1;
        const papel = this.add.image(W / 2, H, 'pista');
        papel.setOrigin(0.5, 1);
        papel.setScale(ESCALA_PAPEL);

        //SetDepth es para poner cosas por encima
        //El texto de la pista va sobre el papel, DENTRO del hueco libre (sin tapar las manos).
        //HUECO = rectangulo libre medido en pixeles de la imagen PistasBomba.png (593x280): x/y = esquina sup-izq
        const HUECO = { x: 204, y: 26, w: 198, h: 200 };
        const hx = papel.x - papel.displayWidth / 2 + (HUECO.x + HUECO.w / 2) * ESCALA_PAPEL;
        const hy = papel.y - papel.displayHeight + (HUECO.y + HUECO.h / 2) * ESCALA_PAPEL;

        const texto = this.add.text(hx, hy, textoPista, {
            fontFamily: 'Isometra',
            fontSize: '24px',
            color: '#2b1d0e',
            align: 'center',
            wordWrap: { width: HUECO.w * ESCALA_PAPEL }
        });
        texto.setOrigin(0.5);

        //Si la pista es larga y no cabe en el hueco se reduce la letra hasta que quepa
        let tamTexto = 24;
        while (texto.height > HUECO.h * ESCALA_PAPEL && tamTexto > 12) {
            tamTexto--;
            texto.setFontSize(tamTexto);
        }

        //Papel y texto van juntos en un contenedor para que bajen a la vez
        const grupoPista = this.add.container(0, 0, [papel, texto]);
        grupoPista.setDepth(5);

        //Tijeras: frame 1 (abiertas) y frame 2 (cerradas), recortes del sprite sheet
        //hx/hy = punto de las mandibulas (fraccion 0-1 del frame) que queda justo en la punta del raton
        const texTijeras = this.textures.get('tijeras');
        texTijeras.add('tijeras_1', 0, 8,   4,  165, 144);
        texTijeras.add('tijeras_2', 0, 185, 27, 179, 100);
        const hotspot = {
            tijeras_1: { hx: 14 / 165, hy: 71 / 144 },
            tijeras_2: { hx: 5 / 179,  hy: 43 / 100 }
        };

        const tijeras = this.add.image(0, 0, 'tijeras', 'tijeras_1');
        this.tijeras = tijeras;
        const ESCALA_TIJERAS = 0.6;
        tijeras.setScale(ESCALA_TIJERAS);

        //Tijeras encima de todo
        tijeras.setDepth(10);
        tijeras.setVisible(false);

        //Cambia de frame
        const ponerFrameTijeras = (frame) => {
            tijeras.setFrame(frame);
            tijeras.setOrigin(hotspot[frame].hx, hotspot[frame].hy);
        };
        ponerFrameTijeras('tijeras_1');

        // Si se pulsa el enter la pista baja y desaparece; despues se activa el juego y las tijeras. Hecho con IA, claude para que quede bonito
        this.input.keyboard.once('keydown-ENTER', () => {
            this.tweens.add({
                targets: grupoPista,

                //Bajada
                y: papel.displayHeight,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    grupoPista.destroy();
                    this.juegoActivo = true;
                    this.input.setDefaultCursor('none');     //se oculta la flechita
                    tijeras.setVisible(true);
                }
            });
        });

        //Click izquierdo frame 2 durante un momento y vuelve al frame 1
        this.input.on('pointerdown', (pointer) => {
            if (!this.juegoActivo || !pointer.leftButtonDown()) return;
            ponerFrameTijeras('tijeras_2');
            this.time.delayedCall(150, () => ponerFrameTijeras('tijeras_1'));
        });

        //Al salir de la escena se devuelve la flechita normal
        this.events.once('shutdown', () => {
            this.input.setDefaultCursor('default');
        });

        //Boton volver
        const boton = this.add.text(W - 95, H - 45, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        boton.setOrigin(0.5);
        boton.setDepth(3);
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
    }

    update(time, delta)
    {
        //Las tijeras siguen al raton
        if (this.tijeras && this.tijeras.visible) {
            const p = this.input.activePointer;
            this.tijeras.setPosition(p.x, p.y);
        }

        //Cuenta atras: solo corre mientras se juega (no durante la pista ni despues de ganar/perder)
        if (this.juegoActivo) {
            this.tiempoRestante -= delta / 1000;

            const t = this.formatoTiempo(this.tiempoRestante);
            if (this.textoTimer.text !== t) this.textoTimer.setText(t);

            //Se acaba el tiempo -> explota
            if (this.tiempoRestante <= 0) {
                this.perder();
            }
        }
    }

    //Segundos -> "MM:SS"
    formatoTiempo(segundos)
    {
        const total = Math.max(0, Math.ceil(segundos));
        const min = Math.floor(total / 60);
        const seg = total % 60;
        return String(min).padStart(2, '0') + ':' + String(seg).padStart(2, '0');
    }

    //VICTORIA: de momento solo se para el juego y se vuelve al selector (PLACEHOLDER, cambiar por lo que corresponda)
    ganar()
    {
        this.juegoActivo = false;
        this.input.setDefaultCursor('default');
        this.tijeras.setVisible(false);

        this.time.delayedCall(800, () => {
            this.scene.start('selector-minigames');
        });
    }

    //DERROTA: se ven las dos paginas de manga una detras de otra
    perder()
    {
        if (this.perdido) return;
        this.perdido = true;
        this.juegoActivo = false;

        //Se devuelve la flechita y se esconden las tijeras
        this.input.setDefaultCursor('default');
        this.tijeras.setVisible(false);

        const W = this.scale.width;
        const H = this.scale.height;

        //Fondo negro que tapa toda la escena y bloquea los clics de debajo
        const negro = this.add.rectangle(W / 2, H / 2, W, H, 0x000000);
        negro.setDepth(20);
        negro.setInteractive();

        const aviso = this.add.text(W - 20, H - 15, 'CLICK PARA CONTINUAR', {
            fontFamily: 'Isometra',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        aviso.setOrigin(1, 1);
        aviso.setDepth(23);
        aviso.setVisible(false);

        //Velocidad del scroll automatico de cada pagina: milisegundos por pixel (MAS ALTO = MAS LENTO)
        //[pagina 1, pagina 2]
        const MS_POR_PIXEL = [14, 26];

        const paginas = ['manga1', 'manga2'];
        let actual = 0;
        let paginaImg = null;
        let recorrido = 0;       //pixeles que hay que recorrer para llegar al final de la pagina
        let yFinal = 0;          //posicion y a la que termina la pagina
        let leida = false;       //true cuando la pagina ya ha llegado abajo del todo

        //Las paginas son verticales (mas altas que la pantalla): se ajustan al ANCHO y bajan solas
        const mostrarPagina = (i) => {
            if (paginaImg) paginaImg.destroy();
            leida = false;
            aviso.setVisible(false);

            //Con pixelArt:true las imagenes se ven pixeladas; para el manga se usa filtro suave
            this.textures.get(paginas[i]).setFilter(Phaser.Textures.FilterMode.LINEAR);

            paginaImg = this.add.image(W / 2, 0, paginas[i]);
            paginaImg.setOrigin(0.5, 0);
            paginaImg.setDepth(21);
            paginaImg.setScale(W / paginaImg.width);

            recorrido = paginaImg.displayHeight - H;

            //Pagina 1: empieza arriba y baja. Pagina 2 (explosion): empieza abajo, en el suelo, y SUBE hasta la nube
            const subir = (i === 1);
            paginaImg.y = subir ? -recorrido : 0;
            yFinal = subir ? 0 : -recorrido;

            this.tweens.add({
                targets: paginaImg,
                y: yFinal,
                duration: recorrido * MS_POR_PIXEL[i],
                delay: 800,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    leida = true;
                    aviso.setVisible(true);
                }
            });
        };

        //Click o ENTER: si la pagina aun esta bajando salta al final; si ya esta abajo pasa a la siguiente
        const avanzar = () => {
            if (!leida) {
                this.tweens.killTweensOf(paginaImg);
                paginaImg.y = yFinal;
                leida = true;
                aviso.setVisible(true);
                return;
            }

            actual++;
            if (actual < paginas.length) {
                mostrarPagina(actual);
            } else {
                this.scene.start('selector-minigames');
            }
        };

        negro.on('pointerdown', avanzar);

        //RUEDA DEL RATON: se puede mover la pagina a mano (al usarla se cancela el scroll automatico)
        this.input.on('wheel', (pointer, objetos, dx, dy) => {
            if (!paginaImg) return;

            this.tweens.killTweensOf(paginaImg);
            paginaImg.y = Phaser.Math.Clamp(paginaImg.y - dy, -recorrido, 0);

            //Si se llega al final de la pagina ya se puede pasar a la siguiente
            const alFinal = Math.abs(paginaImg.y - yFinal) < 2;
            if (alFinal) paginaImg.y = yFinal;
            leida = alFinal;
            aviso.setVisible(alFinal);
        });
        this.input.keyboard.on('keydown-ENTER', avanzar);

        mostrarPagina(0);
    }
}