export default class Bomba_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'bomba-minigame' });
        }


     preload()
    {
        this.load.image('c4', 'assets/minigames/Bomba/Nuke.png');
        this.load.image('mesa', 'assets/minigames/Bomba/Mesa_Herramientas.png');

        //Sprite sheet de los cables (columna izquierda = entero, columna derecha = cortado)
        this.load.image('cables', 'assets/minigames/Bomba/sprite_sheet.png');
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
        const bomba = this.add.image(W / 2, H / 2, 'c4');
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
            cable.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
 
            //Si click izquierdo cambia de estado a cortado
            cable.on('pointerdown', (pointer) => {
                if (!pointer.leftButtonDown()) return;
                if (cable.getData('cortado')) return;
 
                cable.setFrame(c.color + '_2');
                cable.setData('cortado', true);
                cable.disableInteractive();
            });
        }

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



}