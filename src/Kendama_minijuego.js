export default class Kendama_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() {
            super({ key: 'kendama-minigame' });
            this.victoria = false;
        }


    preload()
    {
        //precargo las imagenes
        this.load.image('kendama', 'assets/minigames/Kendama/KendamaDani.png');
        this.load.image('calle', 'assets/minigames/Kendama/Fondo_Japones.png');
        this.load.image('panelVictoria', 'assets/minigames/Kendama/panelVictoria.png');
    }

    create(){

        //CONSTANTES
        const RADIO_BOLA = 40;
        //en negativo para que tire hacia arriba
        const VELOCIDAD_BOLA = -600;
        //gravedad del mundo
        const GRAVEDAD = 550;
        

        const fondo = this.add.image(480, 270, 'calle');
        fondo.setDisplaySize(960, 540);
        
        //imagen del kendama
        const kendama = this.add.image(450, 340, 'kendama');
        kendama.setDisplaySize(360, 450);


        //para que la bola respete los limites visuales
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);



        //bola del kendama (en color rojo)
        this.bola = this.add.circle(650, 400, RADIO_BOLA, 0xff0000);
        //agujero de la bola (color negro)
        this.agujero = this.add.circle(750, 388, 12, 0x000000);

        //añado físicas a la bola
        this.physics.add.existing(this.bola);

        //para que rebote
        this.bola.body.setBounce(0.6);

        //para que el collider interactue con los limites
        this.bola.body.setCollideWorldBounds(true);
        this.bola.body.setCircle(RADIO_BOLA);


        //establece la gravedad  del mundo q afecta a la bola (haciendo que caiga hacia abajo)
        this.physics.world.gravity.y = GRAVEDAD;


        //incio la bola sin velocidad xq si no hace un extraño al recargar la pagina
        //aunque hay un pequeño bug que si mueves el ratón mientras esta cargando pues lo detecta y se empieza a mover la bola antes d tiempo
        //KNOWN ISSUE

        this.bola.body.setVelocity(0,0);
        this.bola.body.setAllowGravity(false);


        //cuando se hace click le aplico fuerza a la bola en vertical
        this.input.on('pointerdown', () => {
            //si ha ganado no quiero que se mueva más la bola
            if(this.victoria){
                return;
            }
            this.bola.body.setAllowGravity(true);
            this.bola.body.setVelocityY(VELOCIDAD_BOLA);
        });

        //aplico fuerza también en horizontal
        this.input.on('pointermove', (pointer) => {
            if(this.victoria){
                return;
            }
            if (pointer.isDown) {
                //detecto hacia donde tiene que ir la bola en función de la posición en x del ratón y de la bola y la multiplico por 3 para que sea más vistoso el cambio de velocidad horizontal
                this.bola.body.setVelocityX((pointer.x - this.bola.x) * 3);
            }
        });

        //collider del palo
        this.palo = this.add.rectangle(
            450, 450,       //centro del collider
            20, 510,        //ancho y alto
            0x00ff00, 0.3   //color (verde) y transparencia
        );

        //le digo a phaser que participa en las físicas y como está en true es que es estático
        this.physics.add.existing(this.palo, true);

        //añado el collider
        this.physics.add.collider(this.bola, this.palo);
                

        //zona de captura (ciruculo rojo)
        this.zonaCaptura = this.add.circle(
            450, 170,       //posición d la punta
            12,             //radio
            0xff0000,
            0.5
        );

        //lo añado al sistema de fisicas (aqunque estoo sería como un trigger)
        this.physics.add.existing(this.zonaCaptura, true);

        //cuerda
        this.cuerda = this.add.graphics();



        //lo mismo
        this.physics.add.existing(this.agujero);

        
        //le quito la gravedad y hago que no se pueda mvoer
        this.agujero.body.setAllowGravity(false);
        this.agujero.body.setImmovable(true);


        //si se tocan el agujero con el trigger d la punta hemos ganado
        this.physics.add.overlap(
            this.agujero,
            this.zonaCaptura,
            () => {

            
            if (this.victoria)
            {
                return;
            } 

            this.victoria = true;

                //reincio los valores para la próxima vez que se entre al minijuego
               this.bola.body.setVelocity(0, 0);
               this.bola.body.setAllowGravity(false);

               //pongo el delayedCall para que espere 0.8s antes de llamar al panel de victoria y asi se vea como la bola ha sido clavada en el kendama
               this.time.delayedCall(800,()=>{
                    this.mostrarPanelVictoria();
               });

                console.log("¡ENCeste!");
            }
        );



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
        const BORDE_BOLA = -30;

        this.agujero.setPosition(this.bola.x,this.bola.y - BORDE_BOLA);

        //borro la cuerda para dibujar la actual
        this.cuerda.clear();

        //la dibujo con 4 d grosor y en blanco
        this.cuerda.lineStyle(4, 0xffffff);

        //y pinto la linea entre el punto fijo que es el medio del kendama y la posición actual de la bola
        this.cuerda.lineBetween(450, 290,this.bola.x, this.bola.y);
    }



    mostrarPanelVictoria(){

        //mostrar imagen de victoria
        const panel = this.add.image(this.scale.width/2,this.scale.height/2,'panelVictoria');

        panel.setDepth(100);
        panel.setScale(0.4);

        //boton volver al menu
        const botonMenu = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 60,
            'VOLVER AL MENÚ',
            {
                fontFamily: 'Isometra',
                fontSize: '32px',
                color: '#030303',
                backgroundColor: '#ccff00',
                padding: { x: 20, y: 12 }
            }
        );

        botonMenu.setOrigin(0.5);
        botonMenu.setScale(0.9);
        botonMenu.setDepth(101);
        botonMenu.setInteractive({ useHandCursor: true });


        botonMenu.on('pointerdown', () => {
            //reinicio todo 
            this.bola.body.setVelocity(0,0);
            this.bola.body.setAllowGravity(false);
            this.victoria = false;

            this.scene.start('menu-principal');
        });


    }

    

}

