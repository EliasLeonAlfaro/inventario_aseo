import axios from 'axios';

// Configuramos la URL base de tu backend de Spring Boot
const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Exportamos las funciones que usará cada pantalla
export const inventarioService = {
    // 1. Obtener todos los artículos de aseo
    obtenerProductos: () => API.get('/productos'),

    // 2. Crear un producto desde cero
    crearProducto: (producto) => API.post('/productos', producto),

    // 3. Registrar una compra (para sumar stock y recalcular costo ponderado)
    registrarCompra: (id, cantidad, precioCompra) =>
        API.put(`/productos/${id}/comprar?cantidad=${cantidad}&precioCompra=${precioCompra}`),

    // 4. Obtener las categorías para los formularios
    obtenerCategorias: () => API.get('/categorias'),

    // 5. Crear una nueva categoría
    crearCategoria: (categoria) => API.post('/categorias', categoria)
};

export const ventasService = {
    // 1. Registrar una venta nueva (descuenta stock)
    registrarVenta: (detallesVenta) => API.post('/ventas', detallesVenta),

    obtenerVentas: () => API.get('/ventas')
};

export const reportesService = {
    obtenerProductoEstrella: (tipo) => API.get(`/reportes/productos-estrella?tipo=${tipo}`),
    // 🔥 NUEVO
    obtenerGanancias: (tipo) => API.get(`/reportes/ganancias?tipo=${tipo}`)
};