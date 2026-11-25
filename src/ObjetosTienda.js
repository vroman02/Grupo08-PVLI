//catálogo de objetos disponibles en la tienda
const OBJETOS_TIENDA = [
    {
        id: 'dado-blanco',
        nombre: 'Dado Blanco',
        textura: 'tienda-izquierda',
        precio: 30,
        tipo: 'dado'
    },
    {
        id: 'dado-rojo',
        nombre: 'Dado Rojo',
        textura: 'tienda-derecha',
        precio: 30,
        tipo: 'dado'
    },
    {
        id: 'moneda-fortuna',
        nombre: 'Moneda',
        textura: 'goldcoin-heads',
        precio: 20,
        tipo: 'consumible',
        efecto: 'moneda',
        cantidad: 20
    }
];

export default OBJETOS_TIENDA;
