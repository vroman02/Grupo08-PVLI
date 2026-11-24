import Esponja from "./Limpieza_esponja.js";

export default class Limpieza_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'limpieza-minigame' });
        }


    preload()
    {
        this.load.image('esponja', 'assets/minigames/Limpieza/esponja.png');
        this.load.image('pared', 'assets/minigames/Limpieza/Pared.jpg');
        this.NUM_GRAFFITIS = 15;
        //Graffiti random
        this.graffitiActual = Phaser.Math.Between(1, this.NUM_GRAFFITIS);
        if (this.textures.exists('graffiti'))
        {
            this.textures.remove('graffiti');
        }
        this.load.image('graffiti',`assets/minigames/Limpieza/Graffitis/${this.graffitiActual}.png`);
    }

    create(){

        //Imagen del fondo
        const fondo = this.add.image(480, 270, 'pared');
        fondo.setDisplaySize(960, 540);

        //Se crea el grafitti
        const graffiti = this.add.image(this.scale.width/2, this.scale.height/2, 'graffiti');
        graffiti.setDisplaySize(840, 540);

        //Se crea la máscara
        this.mascara = this.add.renderTexture(this.scale.width/2, this.scale.height/2, 960, 540);
        this.mascara.fill(0xffffff);
        this.mascara.render();
        graffiti.enableFilters().filters.external.addMask(this.mascara);
        this.mascara.setVisible(false);

        // Rejilla de puntos donde hay pintura (alfa del grafitti > 0).
        // Se usan los píxeles reales de la imagen para no contar las zonas transparentes.
        const CELDA = 10;
        const textura = this.textures.get('graffiti').getSourceImage();
        const izquierda = graffiti.x - graffiti.displayWidth / 2;
        const arriba = graffiti.y - graffiti.displayHeight / 2;
        this.manchas = [];
        for (let y = arriba + CELDA / 2; y < arriba + graffiti.displayHeight; y += CELDA) {
            for (let x = izquierda + CELDA / 2; x < izquierda + graffiti.displayWidth; x += CELDA) {
                const tx = Math.floor((x - izquierda) / graffiti.displayWidth * textura.width);
                const ty = Math.floor((y - arriba) / graffiti.displayHeight * textura.height);
                if (this.textures.getPixelAlpha(tx, ty, 'graffiti') > 0) this.manchas.push({ x, y });
            }
        }
        this.totalManchas = this.manchas.length;
        this.terminado = false;

        this.textoProgreso = this.add.text(20, 20, '0%', { fontSize: '30px', fontFamily: 'Isometra', color: '#ffffff' });

        //Se borra el grafitti
        this.input.on('pointermove', pointer => {
            if (!pointer.isDown || this.terminado) return;
            this.mascara.erase(this.espon).render();

            // Se quitan los puntos que tapa la esponja (misma posición que usa erase())
            const radio = this.espon.displayWidth / 2;
            this.manchas = this.manchas.filter(p =>
                Math.abs(p.x - this.espon.x) > radio || Math.abs(p.y - this.espon.y) > radio);

            const limpio = 1 - this.manchas.length / this.totalManchas;
            this.textoProgreso.setText(`${Math.floor(limpio * 100)}%`);

            // 97% y no 100%: nadie llega a cada píxel de los bordes
            if (limpio >= 0.99) {
                this.terminado = true;
                this.mascara.clear().render();   // se borra lo que quede
                this.textoProgreso.setText('100%');
                boton.setVisible(true);
                //this.events.emit('limpieza-completa');  // o this.scene.start(...)
            }
        });

        //Imagen de la esponja
        this.espon = new Esponja(this, 450, 270);
        this.espon.setDisplaySize(100,100);

        //Boton volver
        const boton = this.add.text(825, 480, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        boton.setVisible(false);

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
            this.scene.start('selector-minigames');
        });
    }

    update()
    {
        this.espon.update();
    }


}