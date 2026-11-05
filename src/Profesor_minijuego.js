import pregunta from './pregunta.js';

export default class Profesor_minijuego extends Phaser.Scene 
{
// Nombre de la escena para el SceneManager
    constructor() 
    {
        super({ key: 'profesor-minigame' });

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

    }

    create()
    {
        this.spawnProfeContento();
        
        this.spawnProfeEnfadado();
        this.profeEnfadado.setVisible(false);

        this.mostrarPregunta();

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
    }

    spawnProfeContento()
    {
        this.profeContento = this.add.image(480, 270, 'contento');
        this.profeContento.setDisplaySize(960, 540);
    }

    spawnProfeEnfadado()
    {
        this.profeEnfadado = this.add.image(450, 270, 'enfadado');
        this.profeEnfadado.setDisplaySize(360, 450);
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

        //Si se ha acertado se quita al profe enfadado y se vuelve a poner al contento
        this.miPregunta.on('acierto', () => {
            console.log("¡Has acertado!");
            this.profeEnfadado.setVisible(false);
            this.profeContento.setVisible(true);
            this.siguientePregunta();
        });

        //Si se ha fallado se quita al profe contento y se pone al enfadado
        this.miPregunta.on('fallo', () => {
            console.log("¡Has acertado!");
            this.profeContento.setVisible(false);
            this.profeEnfadado.setVisible(true);
            this.siguientePregunta();
        });
    }

    siguientePregunta()
    {
        //Aumentar el índice de pregunta
        this.indicePreguntaActual++;
        
        // Temporizador entre preguntas para poder ver cuál era la respuesta
        this.time.delayedCall(1500, () => {
            this.mostrarPregunta();
            //Cuando carga la nueva pregunta el profe deja de estar enfadado (TEMPORAL)
            this.profeEnfadado.setVisible(false);
            this.profeContento.setVisible(true);
        });
    }
}

