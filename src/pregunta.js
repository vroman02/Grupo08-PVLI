export default class pregunta extends Phaser.GameObjects.Container
{

    constructor(scene, x, y, pregunta, respuestas, preguntaCorrecta)
    {
        super(scene, x, y);
        scene.add.existing(this);

        //Guardar los datos
        this.preguntaTexto = pregunta;
        this.respuestas = respuestas;
        this.indiceCorrecto = preguntaCorrecta;

        this.setAlpha(0);
        this.setScale(0.7);
        
        // Animación de entrada
        scene.tweens.add({
            targets: this,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 400,   // Tarda 0.4 segundos
            ease: 'Back.easeOut'
        });

        //Texto de la pregunta
        let textoPregunta = scene.add.text(0, 0, pregunta, {
        fontFamily: 'Isometra',
        fontSize: '30px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: { x: 15, y: 15 },
        align: 'center',
        wordWrap: { width: 700 }
        });
        textoPregunta.setOrigin(0.5);
        this.add(textoPregunta);

        // Crear las respuestas
        this.crearRespuestas(scene);
    }

    crearRespuestas(scene)
    {
        //Guardar todas las respuestas en un array para luego saber cuál colorear de qué color
        let listaRespuestas = [];

        //Crea las 4 respuestas
        for(let i = 0; i < this.respuestas.length; i++)
        {
            let yPos;
            let xPos;

            if(i == 0 || i == 2)
            {
                xPos = -250;
            }
            else
            {
                xPos = 250;
            }

            if(i < 2)
            {
                yPos = 280;
            }
            else
            {
                yPos = 380;
            }

            let textoRespuesta = scene.add.text(xPos, yPos, this.respuestas[i], {
                fontFamily: 'Isometra',
                fontSize: '30px', 
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: { x: 20, y: 10 },
                align: 'center',
                wordWrap: { width: 450 }
            });
            textoRespuesta.setOrigin(0.5);

            listaRespuestas[i] = textoRespuesta;

            textoRespuesta.setInteractive({ useHandCursor: true });

            textoRespuesta.on('pointerover', () => {
                textoRespuesta.setStyle({
                    color: '#ffffff',
                    backgroundColor: '#83e5ee'
                });

                //Asegurar que no haya otra animación
                scene.tweens.killTweensOf(textoRespuesta);

                //Hacer el botón más grande
                scene.tweens.add({
                    targets: textoRespuesta,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 150,
                    ease: 'Back.easeOut' //Efecto de rebote
                });
            });

            textoRespuesta.on('pointerout', () => {
                textoRespuesta.setStyle({
                    color: '#000000',
                    backgroundColor: '#ffffff'
                });

                //Quitar la animación anterior
                scene.tweens.killTweensOf(textoRespuesta);

                //Animación para volver a su tamaño original
                scene.tweens.add({
                    targets: textoRespuesta,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Sine.easeInOut'
                });
            });

            //Al hacer click se desactivan los botones y se comprueba la respuesta
            textoRespuesta.on('pointerdown', () => 
            {
                scene.tweens.killTweensOf(textoRespuesta);
                textoRespuesta.setScale(1);
                
                //Bloquear los botones para evitar cambiar la respuesta
                listaRespuestas.forEach(boton => {
                    boton.disableInteractive();
                    boton.off('pointerover');
                    boton.off('pointerout');
                });

                if (i === this.indiceCorrecto) 
                {
                    textoRespuesta.setStyle({
                        color: '#ffffff',
                        backgroundColor: '#28c900'
                    });

                    scene.tweens.add({
                        targets: textoRespuesta,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 200,
                        yoyo: true,  //Crece y se encoje
                        ease: 'Sine.easeInOut'
                    });

                    console.log('¡Has acertado!');
                    this.emit('acierto');
                } 
                else 
                {
                    textoRespuesta.setStyle({
                        color: '#ffffff',
                        backgroundColor: '#c90000'
                    });

                    this.animacionLatido(textoRespuesta, 1.2, 1.2, 200);

                    let botonCorrecto = listaRespuestas[this.indiceCorrecto];
                    botonCorrecto.setStyle({
                        color: '#ffffff',
                        backgroundColor: '#28c900' // Verde
                    });

                    this.animacionLatido(botonCorrecto, 1.3, 1.3, 300);

                    console.log('¡Te has equivocado!');
                    this.emit('fallo');
                }
            });

            this.add(textoRespuesta);
        }
    }

    animacionLatido(objeto, escalaX, escalaY, duracion)
    {
        this.scene.tweens.add({
            targets: objeto,
            scaleX: escalaX,
            scaleY: escalaY,
            duration: duracion,
            yoyo: true,  
            ease: 'Sine.easeInOut'
        });
    }
}