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
    }

    create(){

        //Tamaño real del canvas (800x600 en horizontal) -> todo se calcula relative a esto
        const W = this.scale.width;
        const H = this.scale.height;

        const fondo = this.add.image(W / 2, H / 2, 'mesa');
        fondo.setDisplaySize(W, H);
        fondo.setDepth(0);
        
        //Imagen de la bomba -> MAS GRANDE y en el CENTRO de la escena
        const BOMBA_W = 580;
        const BOMBA_H = 420;
        const bomba = this.add.image(W / 2, H / 2, 'Nuke');
        bomba.setDisplaySize(BOMBA_W, BOMBA_H);
        bomba.setDepth(1);

        //CABLES. Buscado en google el como hacer el array para los cables
        //x1/x2/y/w/h = recorte REAL del sprite sheet (NO tocar: si se cambian, el frame sale transparente)
        //dx/dy = desplazamiento manual (px) para anidar las L como en la referencia
        const ESCALA = 0.95;                 //escala de los cables (proporcional al tamano nuevo de la bomba)
        const FX = -0.17;                    //fraccion horizontal del sprite donde anclar el cable mas externo (verde)
        const FY =  0.12;                    //fraccion vertical del sprite donde anclar ese mismo cable
        const cablesData = [
            { color: 'rojo',     x1: 305, x2: 1105, y: 236,  w: 116, h: 76, dx:  14, dy: -14 },
            { color: 'amarillo', x1: 293, x2: 1093, y: 837,  w: 127, h: 85, dx:   7, dy:  -7 },
            { color: 'verde',    x1: 281, x2: 1081, y: 1437, w: 140, h: 97, dx:   0, dy:   0 },
            { color: 'azul',     x1: 281, x2: 1081, y: 2120, w: 137, h: 30, dx:   7, dy:  10 }
        ];

        //Ancla base = esquina inferior-izquierda del haz, dentro del panel gris de la bomba
        const px = bomba.x + FX * BOMBA_W;
        const py = bomba.y + FY * BOMBA_H;

        const texCables = this.textures.get('cables');
 
        for (let i = 0; i < cablesData.length; i++) {
            const c = cablesData[i];
 
            //Registramos los frames (estado 1 y estado 2) del cable
            texCables.add(c.color + '_1', 0, c.x1, c.y, c.w, c.h);
            texCables.add(c.color + '_2', 0, c.x2, c.y, c.w, c.h);
 
            const cable = this.add.image(px + c.dx, py + c.dy, 'cables', c.color + '_1');
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
            });
        }

        //Hasta que baje la pista no se puede empezar a jugar
        this.juegoActivo = false;

        //Pista: al empezar se ve en el centro. Con ENTER baja en linea recta (sin aceleracion)
        const papel = this.add.image(W / 2, H / 2, 'pista');

        //SetDepth es para poner cosas por encima
        papel.setDepth(5);

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
                targets: papel,

                //Bajada
                y: H + papel.height / 2,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    papel.destroy();
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

    update()
    {
        //Las tijeras siguen al raton
        if (this.tijeras && this.tijeras.visible) {
            const p = this.input.activePointer;
            this.tijeras.setPosition(p.x, p.y);
        }
    }



}