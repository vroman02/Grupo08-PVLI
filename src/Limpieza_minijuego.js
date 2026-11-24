import Esponja from "./Limpieza_esponja.js";
import VariablesGlobales from "./VariablesGlobales.js";

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
       
        //Graffiti random
         this.NUM_GRAFFITIS = 15;
        this.graffitiActual = Phaser.Math.Between(1, this.NUM_GRAFFITIS);
        if (this.textures.exists('graffiti'))
        {
            this.textures.remove('graffiti');
        }
        this.load.image('graffiti',`assets/minigames/Limpieza/Graffitis/${this.graffitiActual}.png`);

        //Temporizador
        if (VariablesGlobales.ModoInfierno)
        {
            this.tiempoMaximo = 5;
        }
        else
        {
            this.tiempoMaximo = 10;
        }
        this.tiempoRestante = this.tiempoMaximo;
        this.load.image('imagenContador', 'assets/minigames/Profesor/ConejoReloj.jpg');
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
            if (limpio >= 0.999) {
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
        this.boton = this.add.text(825, 480, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        this.boton.setVisible(false);

        this.boton.setOrigin(0.5);
        this.boton.setInteractive({ useHandCursor: true });

        this.boton.on('pointerover', () => {
            boton.setStyle({
                color: '#ffffff',
                backgroundColor: '#2274d7'
            });
        });

        this.boton.on('pointerout', () => {
            boton.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
        });

        this.boton.on('pointerdown', () => {
            this.scene.start('selector-minigames');
        });

        //Tiempo restante para responder
        this.textoTiempo = this.add.text(820, 0, this.tiempoMaximo, {
            fontFamily: 'Isometra',
            fontSize: '40px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 70, y: 15 },
            align: 'right',
            wordWrap: { width: 700 }
        });
        this.textoTiempo.setDepth(1);

        this.imgContador = this.add.image(830, 17, 'imagenContador');
        this.imgContador.setDisplaySize(40, 45);
        this.imgContador.setOrigin(0, 0);
        this.imgContador.setDepth(2);

        //Sin esto su animación va rara
        this.escalaOriginalImgX = this.imgContador.scaleX;
        this.escalaOriginalImgY = this.imgContador.scaleY;


        this.iniciarTemporizador();
    }

    update()
    {
        this.espon.update();
        if (this.terminado)
        {
            this.temporizador.remove();
            this.imgContador.setVisible(false);
            this.textoTiempo.setVisible(false);
            this.boton.setVisible(true);
        }
    }

    iniciarTemporizador()
    {
        //Si existe un temporizador se borra antes de crear uno nuevo
        if (this.temporizador) this.temporizador.remove();
        //Reiniciar variables
        this.tiempoRestante = this.tiempoMaximo;
        this.textoTiempo.setText(String(this.tiempoRestante));
        // Vuelve a negro al empezar
        this.textoTiempo.setColor('#000000');
        this.textoTiempo.setBackgroundColor('#ffffff');

        //Da un tick cada 1s
        this.temporizador = this.time.addEvent({
            delay: 1000,
            callback: this.tickTiempo,
            callbackScope: this,
            loop: true
        });
    }

    tickTiempo()
    {
        this.tiempoRestante--;
        
        if (this.tiempoRestante > 0) 
        {
            this.textoTiempo.setText(String(this.tiempoRestante));
            //Si quedan x segundos se pone en rojo
            if (this.tiempoRestante <= 3) 
            {
                this.textoTiempo.setColor('#ff0000');
            }

        } 
        else 
        {
            //Se acabó el tiempo
            this.textoTiempo.setText("0");
            this.textoTiempo.setColor('#ffFFFF');
            this.textoTiempo.setBackgroundColor('#ff0000');
            this.temporizador.remove();
            if (!this.terminado)
            {
                this.terminado = true;
            }
        }

        //Animación del contador
        this.animacionLatido(this.textoTiempo, 1.2, 1.2, 200);

        //Animación de la imagen del contador
        this.animacionLatido(this.imgContador, this.escalaOriginalImgX * 1.2, this.escalaOriginalImgY * 1.2, 200);
    }

    animacionLatido(objeto, escalaX, escalaY, duracion)
    {
        this.tweens.add({
            targets: objeto,
            scaleX: escalaX,
            scaleY: escalaY,
            duration: duracion,
            yoyo: true,  
            ease: 'Sine.easeInOut'
        });
    }


}