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
    }

    create()
    {   
        //Cuando se quita la escena el cursor se vuelve a mostrar
        this.events.once('shutdown', () => {
            this.input.setDefaultCursor('default');
        });

        const fondo = this.add.image(480, 270, 'fabrica');
        fondo.setDisplaySize(960, 740);

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
            nuevoEnemigo.on('pointerdown', () => {
                if(this.contador >= this.cooldownDisparo)
                {
                    vida--;
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

}