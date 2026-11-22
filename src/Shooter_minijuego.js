import Shooter_enemy from './Shooter_enemy.js';
import mira from'./mira.js';
export default class Shooter_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() 
    {
        super({ key: 'shooter-minigame' });

        this.cooldownDisparo = 250;
    }

    init()
    {
        this.vidaJugador = 100;
        this.contador = 0;
        this.listaEnemigos = [];
        this.contadorEnemigos = 0;
        this.numEnemigos = 0;
        this.enemigosMuertos = 0;
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
        this.efectoDaño.setDepth(100);

        this.mira = new mira(this, 0, 0);
        this.mira.setDisplaySize(50, 50);
        this.mira.setDepth(30); 
        this.input.setDefaultCursor('none');

        this.numEnemigos = Phaser.Math.Between(5, 15);
        console.log(this.numEnemigos);
        this.listaEnemigos = [];
        this.contadorEnemigos = 0;

        this.contador = 0;

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
        this.pistol.setDepth(10); 
        
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
            this.contadorEnemigos++;
        }
        
        //Contador
        this.time.addEvent({
            delay: 2000, // 2000 ms = 2 segundos
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
        this.textoVida.setDepth(20); 
        

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
        boton.setDepth(20); 

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
        if(this.contadorEnemigos <= this.numEnemigos)
        {
            let randomCoor = Phaser.Math.Between(100, 800);
            let nuevoEnemigo = new Shooter_enemy(this, randomCoor, 200);
            let vida = 3;

            nuevoEnemigo.setDisplaySize(360, 450);

            nuevoEnemigo.setInteractive();
            nuevoEnemigo.on('pointerdown', (pointer) => {
                if(this.contador >= this.cooldownDisparo)
                {
                    //Obtener el rectángulo del enemigo
                    let bounds = nuevoEnemigo.getBounds();

                    //Definir el límite de la cabeza
                    let limiteVerticalCabeza = bounds.top + (bounds.height * 0.2);

                    let centroX = nuevoEnemigo.x;
                    let anchoCabeza = nuevoEnemigo.displayWidth * 0.15; 
                    
                    let limiteIzquierda = centroX - anchoCabeza;
                    let limiteDerecha = centroX + anchoCabeza;

                    //Comprobar si el clic ha sido por encima de ese límite
                    let esHeadshot = (pointer.y <= limiteVerticalCabeza && pointer.x >= limiteIzquierda && pointer.x <= limiteDerecha);

                    // Si es crítico hace 2 de daño, si no, 1
                    let daño = 1;
                    let esCritico = Math.random() < 0.06; //6% de probabilidad

                    if (esHeadshot && esCritico) 
                    {
                        daño = 5; // Headshot con crítico hace muchísimo daño
                        esCritico = true;
                    }
                    else if (esHeadshot) 
                    {
                        daño = 3; // Headshot hace mucho daño
                        esCritico = true;
                    } 
                    else if (esCritico) 
                    {
                        daño = 2;
                    }

                    vida -= daño;

                    this.crearNumeroDaño(pointer.x, pointer.y, daño, esCritico, esHeadshot);

                    this.animacionHit(nuevoEnemigo, 1.2, 1.2, 100, esCritico, esHeadshot);

                    if(vida <= 0)
                    {
                        this.listaEnemigos = this.listaEnemigos.filter(e => e !== nuevoEnemigo);
                        this.enemigosMuertos++;
                        nuevoEnemigo.destroy();

                        //Carga el tablero si has matado a todos los enemigos
                        if(this.enemigosMuertos == this.numEnemigos)
                        {
                            console.log('has ganado');
                            this.scene.start('tablero-principal');
                        }
                    }
                }
            })

            //Cuando recibes daño se muestra, si la vida es 30 o menos se muestra en rojo
            nuevoEnemigo.on('recibe-daño', () => {
                this.vidaJugador -= nuevoEnemigo.daño;
                this.textoVida.setText(`VIDA: ${this.vidaJugador}`);

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
            this.contadorEnemigos++;
        }
        
    }

    animacionHit(objeto, multX, multY, duracion, critico, headshot)
    {
        //Guardar la escala que tiene el objeto en este justo momento
        let escalaActualX = objeto.scaleX;
        let escalaActualY = objeto.scaleY;

        this.tweens.add({
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
    }

    crearNumeroDaño(x, y, cantidad, critico, headshot)
    {
        let textoDaño;

        if(critico)
        {
            //Crear el texto con un borde negro
            textoDaño = this.add.text(x, y, `-${cantidad}`, {
                fontFamily: 'Isometra',
                fontSize: '70px',
                color: '#ffbb00',
                stroke: '#000000',
                strokeThickness: 6      // Grosor del borde
            });
        }
        else if(headshot)
        {
            // Texto para Headshot (Enorme y morado/rosa)
            textoDaño = this.add.text(x, y, textoAMostrar, {
                fontFamily: 'Isometra',
                fontSize: '60px',
                color: '#ffed48', 
                stroke: '#000000',
                strokeThickness: 8
            });
        }
        else
        {
            //Crear el texto con un borde negro
            textoDaño = this.add.text(x, y, `-${cantidad}`, {
                fontFamily: 'Isometra',
                fontSize: '50px',
                color: '#ff0000',
                stroke: '#000000',
                strokeThickness: 6      // Grosor del borde
            });
        }
        
        textoDaño.setOrigin(0.5);
        textoDaño.setDepth(50);

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