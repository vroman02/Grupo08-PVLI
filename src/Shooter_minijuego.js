import Shooter_enemy from './Shooter_enemy.js';
import Shooter_shieldEnemy from './Shooter_shieldEnemy.js';
import Shooter_zigzagEnemy from './Shooter_zigzagEnemy.js';
import Shooter_civil from './Shooter_civil.js';
import mira from'./mira.js';
import VariablesGlobales from "./VariablesGlobales.js";
export default class Shooter_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() 
    {
        super({ key: 'shooter-minigame' });

        this.cooldownDisparo = 250;
        this.tiempoDeSpawneo = 1500;
    }

    init()
    {
        this.vidaJugador = 100;
        this.contador = 0;
        this.listaEnemigos = [];
        this.contadorEnemigos = 0;
        this.numEnemigos = 0;
        this.enemigosMuertos = 0;
        this.contadorEscudos = 0;
        this.contadorZigzag = 0;
        this.contadorCivil = 0;
        this.maxCivil = 1;
        this.tiempoDeSpawneo = 1500;

        if(VariablesGlobales.ModoInfierno)
        {
            this.tiempoDeSpawneo = 1000;
            this.maxCivil = 5;
        }
    }

    preload()
    {
        this.load.image('fabrica', 'assets/minigames/Shooter/FondoFabrica.png');
        this.load.image('pistola', 'assets/minigames/Shooter/pistola.png');
        this.load.image('mira', 'assets/minigames/Shooter/mira.png');
        this.load.spritesheet('pistolaAnimada', 'assets/minigames/Shooter/first_person_gun.png', {
            frameWidth: 180,
            frameHeight: 180
        });

        //Enemigo
        this.load.image('enemigo', 'assets/characters/DoctorMuerte.png');

        //Enemigo con escudo
        this.load.image('enemigoEscudo', 'assets/characters/Swat.png');

        //Enemigo zigzag
        this.load.image('enemigoZigzag', 'assets/characters/Frozono.png');

        //Civil
        this.load.image('civil', 'assets/characters/mamaCoco.png');

        //Viñeta de recibir dañó
        this.load.image('viñetaDaño', 'assets/minigames/Shooter/ViñetaDaño.png');
    }

    create()
    {   
        //Cuando se quita la escena el cursor se vuelve a mostrar
        this.events.once('shutdown', () => {
            this.input.setDefaultCursor('default');
        });

        const fondo = this.add.image(480, 270, 'fabrica');
        fondo.setDisplaySize(960, 740);

        //Crear la viñeta del efecto de daño
        this.efectoDaño = this.add.image(0, 0, 'viñetaDaño');
        this.efectoDaño.setOrigin(0, 0);
        this.efectoDaño.setDisplaySize(this.scale.width, this.scale.height);
        this.efectoDaño.setAlpha(0);
        this.efectoDaño.setDepth(150);

        this.mira = new mira(this, 0, 0);
        this.mira.setDisplaySize(50, 50);
        this.mira.setDepth(110); 
        this.input.setDefaultCursor('none');

        this.numEnemigos = Phaser.Math.Between(10, 15);
        console.log(this.numEnemigos);
        this.listaEnemigos = [];
        this.contadorEnemigos = 0;

        this.contador = 0;
        this.contadorEscudos = 0;
        this.maxEscudos = 2;
        this.maxZigzag = 1; 

        //Crear animación
        if(!this.anims.exists('disparar'))
        {
            this.anims.create({
                key: 'disparar',
                frames: this.anims.generateFrameNumbers('pistolaAnimada', {start: 0, end: 13}),
                frameRate: 12,
            });
        }

        this.pistol = this.add.sprite(780, 315, 'pistolaAnimada');
        this.pistol.setDisplaySize(360, 450);
        //Para que se muestre por encima de todo
        this.pistol.setDepth(95); 
        
        //Al hacer click se dispara la pistola si se ha cumplido el cooldown
        this.input.on('pointerdown', (pointer) => {
            if(this.contador >= this.cooldownDisparo)
            {
                this.contador = 0;
                this.pistol.play('disparar');
            }
        });

        if(this.contadorEnemigos <= this.numEnemigos)
        {
            this.generaEnemigo();
            //this.contadorEnemigos++;
        }
        
        //Contador
        this.time.addEvent({
            delay: this.tiempoDeSpawneo,
            callback: this.generaEnemigo,
            callbackScope: this,
            loop: true
        });

        //Texto vida
        this.textoVida = this.add.text(0, 0, `VIDA: ${this.vidaJugador}`, {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        this.textoVida.setDepth(200); 

        //Texto enemigos restantes
        this.textoEnemigosRestantes = this.add.text(650, 0, `ENEMIGOS: ${this.numEnemigos}`, {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        this.textoEnemigosRestantes.setDepth(200); 

        //Boton volver
        const boton = this.add.text(825, 480, 'VOLVER', {
            fontSize: '30px',
            fontFamily: 'Isometra',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });

        boton.setOrigin(0.5);
        boton.setInteractive({ useHandCursor: true });
        boton.setDepth(100); 

        boton.on('pointerover', () => {
            boton.setStyle({
                color: '#ffffff',
                backgroundColor: '#2274d7'
            });
            this.mira.setVisible(false);
        });

        boton.on('pointerout', () => {
            boton.setStyle({
                color: '#000000',
                backgroundColor: '#ffffff'
            });
            this.mira.setVisible(true);
        });

        boton.on('pointerdown', () => {
            this.scene.start('selector-minigames');
        });
    }

    update(t, dt) 
    {
        // Limpia los enemigos muertos del array
        this.listaEnemigos = this.listaEnemigos.filter(enemigo => enemigo.active);

        //Actualizar cada enemigo
        this.listaEnemigos.forEach(enemigo => {
            enemigo.update(t, dt);
        });

        //Actualizar la mira
        this.mira.update(t, dt);

        //Actualizar el contador
        this.contador += dt;
    }

    generaEnemigo()
    {
        //Ya se han generado los necesarios
        if(this.contadorEnemigos >= this.numEnemigos) return;

        //Ya has ganado
        if(this.enemigosMuertos >= this.numEnemigos) return;

        if(this.contadorEnemigos <= this.numEnemigos)
        {
            let randomCoorX = Phaser.Math.Between(100, 800);
            let randomCoorY = Phaser.Math.Between(150, 400);
            let enemigoElegido;

            if(VariablesGlobales.ModoInfierno)
            {
                enemigoElegido = Phaser.Math.Between(0, 10); //Probabilidad de civil más alta

            }
            else enemigoElegido = Phaser.Math.Between(0, 6);

            if(enemigoElegido == 4 && this.contadorEscudos >= this.maxEscudos)
            {
                enemigoElegido = 1;
            }
            // Si el zigzag está al máximo, tiramos de común
            if (enemigoElegido == 5 && this.contadorZigzag >= this.maxZigzag)
            {
                enemigoElegido = 1;
            }
            if(enemigoElegido >= 6 && this.contadorCivil >= this.maxCivil)
            {
                console.log("Civil no spawneado");
                enemigoElegido = 1;
            }

            let nuevoEnemigo;

            if(enemigoElegido <= 3)
            {
                nuevoEnemigo = new Shooter_enemy(this, randomCoorX, 200);
                nuevoEnemigo.vida = 5;

                nuevoEnemigo.setDisplaySize(250, 420);
                nuevoEnemigo.setInteractive();

                nuevoEnemigo.on('pointerdown', (pointer) =>
                {
                    this.hit(nuevoEnemigo, pointer, false, () =>
                    {
                        this.listaEnemigos = this.listaEnemigos.filter(e => e !== nuevoEnemigo);
                        this.enemigosMuertos++;
                        this.actualizarContadorEnemigos();
                        this.comprobarVictoria();
                    });
                });

                this.contadorEnemigos++;
            }
            else if(enemigoElegido == 4)
            {
                let randomEdge = Phaser.Math.Between(0, 1);
                let coorX;
                if(randomEdge == 0) coorX = -150;
                else coorX = 1100;

                nuevoEnemigo = new Shooter_shieldEnemy(this, coorX, randomCoorY);
                nuevoEnemigo.setDisplaySize(200, 350);
                nuevoEnemigo.setInteractive();
                nuevoEnemigo.setDepth(90);

                nuevoEnemigo.on('pointerdown', (pointer) =>
                {
                    this.crearNumeroDaño(pointer.x, pointer.y, 0, false, false);
                });

                this.contadorEscudos++;

                //Cuando el swat se destruye se libera su hueco
                nuevoEnemigo.once('destroy', () => 
                {
                    this.contadorEscudos--;
                });
            }
            else if(enemigoElegido == 5)
            {
                nuevoEnemigo = new Shooter_zigzagEnemy(this, randomCoorX, 200);
                nuevoEnemigo.vida = 5;
                nuevoEnemigo.setDisplaySize(170, 350);
                nuevoEnemigo.setInteractive();
                nuevoEnemigo.setDepth(50);

                nuevoEnemigo.on('pointerdown', (pointer) =>
                {
                    this.hit(nuevoEnemigo, pointer, false, () =>
                    {
                        this.listaEnemigos = this.listaEnemigos.filter(e => e !== nuevoEnemigo);
                        this.enemigosMuertos++;
                        this.actualizarContadorEnemigos();
                        this.comprobarVictoria();
                    });
                });

                this.contadorZigzag++;
                this.contadorEnemigos++;

                //Cuando frozono se destruye se libera su hueco
                nuevoEnemigo.once('destroy', () => 
                {
                    this.contadorZigzag--;
                });
            }
            else if(enemigoElegido >= 6)
            {
                nuevoEnemigo = new Shooter_civil(this, randomCoorX, 200);
                nuevoEnemigo.vida = 1;

                nuevoEnemigo.setDisplaySize(200, 250);
                nuevoEnemigo.setInteractive();
                nuevoEnemigo.setDepth(40);

                this.contadorCivil++;
                nuevoEnemigo.once('destroy', () => 
                {
                    this.contadorCivil--;
                });

                nuevoEnemigo.on('pointerdown', (pointer) =>
                {
                    this.hit(nuevoEnemigo, pointer, true, () =>
                    {
                        this.listaEnemigos = this.listaEnemigos.filter(e => e !== nuevoEnemigo);
                        this.actualizarContadorEnemigos();
                        this.comprobarVictoria();

                        //Todo el bloque de recibir daño
                        this.vidaJugador -= nuevoEnemigo.daño;
                        this.textoVida.setText(`VIDA: ${this.vidaJugador}`);
                        this.animacionLatido(this.textoVida, 1.2, 1.2, 200);

                        //Eliminar cualquier animación anterior por si acaso
                        this.tweens.killTweensOf(this.efectoDaño);

                        this.tweens.add({
                            targets: this.efectoDaño,
                            alpha: 1,      // Aparece al 100%
                            duration: 100,
                            yoyo: true,
                            ease: 'Sine.easeInOut'
                        });

                        if(this.vidaJugador <= 30)
                        {
                            this.textoVida.setColor('#CC0000');
                        }
                        if(this.vidaJugador <= 0)
                        {
                            console.log("Has muerto");
                            this.scene.start('tablero-principal');
                        }
                        console.log("Daño recibido");
                    });
                });
            }
            
            //Cuando recibes daño se muestra, si la vida es 30 o menos se muestra en rojo
            nuevoEnemigo.on('recibe-daño', () => 
            {
                this.vidaJugador -= nuevoEnemigo.daño;
                this.textoVida.setText(`VIDA: ${this.vidaJugador}`);
                this.animacionLatido(this.textoVida, 1.2, 1.2, 200);

                //Eliminar cualquier animación anterior por si acaso
                this.tweens.killTweensOf(this.efectoDaño);

                this.tweens.add({
                    targets: this.efectoDaño,
                    alpha: 1,      // Aparece al 100%
                    duration: 100,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });

                if(this.vidaJugador <= 30)
                {
                    this.textoVida.setColor('#CC0000');
                }
                if(this.vidaJugador <= 0)
                {
                    console.log("Has muerto");
                    this.scene.start('tablero-principal');
                }
                console.log("Daño recibido");
            })

            this.listaEnemigos.push(nuevoEnemigo);
        }
    }

    hit(enemigo, pointer, esCivil, alMorir)
    {
        if (this.contador < this.cooldownDisparo) return;

        //Headshot
        const bounds = enemigo.getBounds();
        const limiteVerticalCabeza = bounds.top + (bounds.height * 0.2);
        const centroX = enemigo.x;
        const anchoCabeza = enemigo.displayWidth * 0.15;
        const limiteIzquierda = centroX - anchoCabeza;
        const limiteDerecha = centroX + anchoCabeza;

        const esHeadshot = pointer.y <= limiteVerticalCabeza && pointer.x >= limiteIzquierda && pointer.x <= limiteDerecha;

        const esCritico = Math.random() < 0.06;

        //Daño
        let daño = 1;
        if(esCivil) daño = 999;
        if (esHeadshot && esCritico) daño *= 5;
        else if (esHeadshot) daño *= 3;
        else if (esCritico) daño *= 2;

        enemigo.vida -= daño;

        //Animacion
        this.crearNumeroDaño(pointer.x, pointer.y, daño, esCritico, esHeadshot);
        const animHit = this.animacionHit(enemigo, 1.2, 1.2, 100, esCritico, esHeadshot);

        if (enemigo.vida <= 0)
        {
            enemigo.disableInteractive();

            if (enemigo.timerDaño)
            {
                enemigo.timerDaño.remove(false);
                enemigo.timerDaño = null;
            }

            animHit.on('complete', () =>
            {
                this.tweens.add({
                    targets: enemigo,
                    alpha: 0,
                    duration: 250,
                    onComplete: () =>
                    {
                        enemigo.destroy();
                        if (alMorir) alMorir.call(this);
                    }
                });
            });
        }
    }

    comprobarVictoria()
    {
        if (this.enemigosMuertos >= this.numEnemigos)
        {
            this.time.delayedCall(500, () => {
                this.scene.start('tablero-principal');
            });
        }
    }

    actualizarContadorEnemigos()
    {
        const restantes = Math.max(0, this.numEnemigos - this.enemigosMuertos);
        this.textoEnemigosRestantes.setText(`ENEMIGOS: ${restantes}`);
        this.animacionLatido(this.textoEnemigosRestantes, 1.2, 1.2, 200);
    }

    animacionHit(objeto, multX, multY, duracion, critico, headshot)
    {
        //Guardar la escala que tiene el objeto en este justo momento
        let escalaActualX = objeto.scaleX;
        let escalaActualY = objeto.scaleY;

        let animacion = this.tweens.add({
            targets: objeto,
            scaleX: multX * escalaActualX,
            scaleY: multY * escalaActualY,
            duration: duracion,
            yoyo: true,  
            ease: 'Sine.easeInOut'
        });

        if(critico) objeto.setTint(0xcc7700); //Teñirlo de blanco
        else if(headshot) objeto.setTint(0xffaa00); //Teñirlo de blanco
        else objeto.setTint(0xff0000); //Teñirlo de rojo

        //Quitar el color rojo al acabar la animacion
        this.time.delayedCall(duracion, () => {
            //Solo quitar el color si no se ha eliminado
            if (objeto.active) 
            {
                objeto.clearTint();
            }
        });

        return animacion;
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

    crearNumeroDaño(x, y, cantidad, critico, headshot)
    {
        let textoDaño;

        if(critico)
        {
            textoDaño = this.add.text(x, y, `-${cantidad}`, {
                fontFamily: 'Isometra',
                fontSize: '70px',
                color: '#ff0000',
                stroke: '#000000',
                strokeThickness: 6      // Grosor del borde
            });
        }
        else if(headshot)
        {
            textoDaño = this.add.text(x, y, `-${cantidad}`, {
                fontFamily: 'Isometra',
                fontSize: '60px',
                color: '#ffd000', 
                stroke: '#000000',
                strokeThickness: 6
            });
        }
        else
        {
            textoDaño = this.add.text(x, y, `-${cantidad}`, {
                fontFamily: 'Isometra',
                fontSize: '50px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6      // Grosor del borde
            });
        }
        
        textoDaño.setOrigin(0.5);
        textoDaño.setDepth(150);

        //Para que no salgan todos en línea recta
        let randomX = Phaser.Math.Between(-30, 30);
        let randomY = Phaser.Math.Between(-40, -80);

        //Sube, crece un poco y desaparece
        this.tweens.add({
            targets: textoDaño,
            x: x + randomX,
            y: y + randomY,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => 
            {
                textoDaño.destroy();
            }
        });
    }
}