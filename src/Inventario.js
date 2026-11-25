export default class Inventario
{

    constructor()
    {
        //guardo los objetos del jugador en unn array
        this.objetos = [];
    }

    //añado un objeto al inventario
    agregarObjeto(objeto)
    {
        this.objetos.push(objeto);
    }

    //elimino un objeto por su posición
    eliminarObjeto(indice)
    {
        this.objetos.splice(indice, 1);
    }

    //devuelvo los objetos del inventario
    obtenerObjetos()
    {
        return this.objetos;
    }

    
}
