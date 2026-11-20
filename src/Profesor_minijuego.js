import pregunta from './pregunta.js';

export default class Profesor_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() 
    {
        super({ key: 'profesor-minigame' });

        this.fallosMaximos = 5;

        //Contador de fallos
        this.fallosActuales = 0;

        //Años de vida, TEMPORAL, esta variable se le comunica al entrar en la escena
        this.añosDeVida = 100;

        //Cantidad de años a restar por fallo, TEMPORAL
        this.añosARestar = 10;

        //Temporizador
        this.tiempoMaximo = 7;
        this.tiempoRestante = this.tiempoMaximo;

        //Lista de preguntas
        this.listaPreguntas = [
            {
                texto: "¿Cuándo se descubrió América?",
                opciones: ["1942", "Ayer", "1492", "1789"],
                correcta: 2
            },
            {
                texto: "¿Quién escribió La Regenta?",
                opciones: ["Lorca", "Clarín", "José Zorrilla", "Jordi Wild"],
                correcta: 1
            },
            {
                texto: "¿Cuál es la capital de Francia?",
                opciones: ["Madrid", "Roma", "París", "Berlín"],
                correcta: 2
            },
            {
                texto: "¿Cuál es el símbolo químico del agua?",
                opciones: ["CO2", "H2O", "O2", "NaCli"],
                correcta: 1
            },
            {
                texto: "¿En qué año comenzó la Revolución Francesa?",
                opciones: ["1492", "1789", "1914", "1812"],
                correcta: 1
            },
            {
                texto: "¿Quién escribió 'Don Quijote de la Mancha'?",
                opciones: ["Lope de Vega", "Miguel de Cervantes", "Federico García Lorca", "David Cánovas"],
                correcta: 1
            },
            {
                texto: "¿Quién pintó la famosa 'Mona Lisa'?",
                opciones: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Salvador Dalí"],
                correcta: 2
            },
            {
                texto: "¿Cuántos lados tiene un hexágono?",
                opciones: ["5", "6", "7", "8"],
                correcta: 1
            },
            {
                texto: "¿Cuál de estos es un motor de videojuegos?",
                opciones: ["Unity", "Photoshop", "Word", "Excel"],
                correcta: 0
            },
            {
                texto: "¿Cuál es el órgano más grande del cuerpo humano?",
                opciones: ["El estómago", "El cerebro", "La piel", "El hígado"],
                correcta: 2
            }
        ];
        
        //Controla por qué pregunta vamos
        this.indicePreguntaActual = 0; 
    }


    preload()
    {
        this.load.image('contento', 'assets/minigames/Profesor/Profe_Contento_Editado.png');
        this.load.image('enfadado', 'assets/minigames/Profesor/Profe_Enfadao_Editado.jpg');
        this.load.image('corazonUI', 'assets/CorazonTemp.png');
        this.load.image('imagenContador', 'assets/minigames/Profesor/ConejoReloj.jpg');
    }

    create()
    {
        this.spawnProfeContento();
        this.spawnProfeEnfadado();

        //El contento empieza siendo totalmente visible y el enfadado no se ve
        this.profeContento.setAlpha(1);
        this.profeEnfadado.setAlpha(0);

        //Años de vida restantes
        this.añosRestantes = this.add.text(0, 0, this.añosDeVida, {
        fontFamily: 'Isometra',
        fontSize: '40px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: { x: 45, y: 15 },
        align: 'center',
        wordWrap: { width: 700 }
        });
        this.añosRestantes.setDepth(10);

        this.corazon = this.add.image(10, 25, 'corazonUI');
        this.corazon.setDisplaySize(30, 30);
        this.corazon.setOrigin(0, 0);
        this.corazon.setDepth(20);

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
        this.textoTiempo.setDepth(10);

        this.imgContador = this.add.image(830, 17, 'imagenContador');
        this.imgContador.setDisplaySize(40, 45);
        this.imgContador.setOrigin(0, 0);
        this.imgContador.setDepth(20);

        //Boton volver
        const boton = this.add.text(855, 515, 'VOLVER', {
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

        this.mostrarPregunta();
    }

    spawnProfeContento()
    {
        this.profeContento = this.add.image(480, 270, 'contento');
        this.profeContento.setDisplaySize(960, 540);
    }

    spawnProfeEnfadado()
    {
        this.profeEnfadado = this.add.image(450, 300, 'enfadado');
        this.profeEnfadado.setDisplaySize(500, 650);
    }

    actualizarEnfado()
    {
        this.fallosActuales++;

        //Da un valor de 0 a 1 en función de cuantos fallos lleves
        const progreso = Phaser.Math.Clamp(this.fallosActuales / this.fallosMaximos, 0, 1);

        //Tweens hace la transición mas suave
        this.tweens.add({
            targets: this.profeEnfadado,
            alpha: progreso,
            duration: 600,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.profeContento,
            alpha: 1 - progreso,
            duration: 600,
            ease: 'Sine.easeInOut'
        });
    }

    iniciarTemporizador()
    {
        //Reiniciar variables
        this.tiempoRestante = this.tiempoMaximo;
        this.textoTiempo.setText(String(this.tiempoRestante));
        // Vuelve a negro al empezar
        this.textoTiempo.setColor('#000000');
        this.textoTiempo.setBackgroundColor('#ffffff');
        this.preguntaActiva = true;

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

            //Solo contar el fallo si aún había pregunta activa
            if (this.preguntaActiva) 
            {
                this.preguntaActiva = false;
                console.log("¡Se acabó el tiempo!");
                this.procesarFallo();
            }
        }
    }

    procesarFallo()
    {
        this.añosDeVida -= this.añosARestar;
        this.añosRestantes.setText(String(this.añosDeVida));
        this.actualizarEnfado();
        this.siguientePregunta();
    }

    mostrarPregunta()
    {
        //Si se ha respondido a todo acaba
        if (this.indicePreguntaActual >= this.listaPreguntas.length) 
        {
            console.log("¡Has terminado todas las preguntas!");
            this.scene.start('tablero-principal'); 
            return;
        }

        // Si ya había una pregunta en pantalla, se destruye
        if (this.miPregunta) 
        {
            this.miPregunta.destroy();
        }

        // Cogemos los datos de la pregunta actual
        let datos = this.listaPreguntas[this.indicePreguntaActual];

        this.miPregunta = new pregunta(
            this, 
            480, 60, 
            datos.texto, 
            datos.opciones, 
            datos.correcta
        );

        this.miPregunta.setDepth(100); 

        this.iniciarTemporizador();

        //Si se ha acertado se quita al profe enfadado y se vuelve a poner al contento
        this.miPregunta.on('acierto', () => {
            console.log("¡Has acertado!");
            this.siguientePregunta();
        });

        //Si se ha fallado se quita al profe contento y se pone al enfadado
        this.miPregunta.on('fallo', () => {
            console.log("¡Has fallado!");
            this.temporizador.remove();
            this.procesarFallo();
        });
    }

    siguientePregunta()
    {
        //Aumentar el índice de pregunta
        this.indicePreguntaActual++;
        
        // Temporizador entre preguntas para poder ver cuál era la respuesta
        this.time.delayedCall(1500, () => {
            this.mostrarPregunta();
        });
    }
}

