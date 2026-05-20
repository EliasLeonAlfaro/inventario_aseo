import React, { useState, useEffect } from 'react';
import { inventarioService, ventasService } from '../services/api';
import { ShoppingCart, Trash2, CheckCircle2, Search } from 'lucide-react';

export default function PuntoVenta() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    // 🔍 ESTADOS PARA EL BUSCADOR PREDICTIVO
    const [busqueda, setBusqueda] = useState('');
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidadSel, setCantidadSel] = useState(1);

    const [boletaFinal, setBoletaFinal] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const respuesta = await inventarioService.obtenerProductos();
            setProductos(respuesta.data);
        } catch (error) {
            console.error("Error al cargar productos en el POS:", error);
        }
    };

    // Filtrado en caliente para las sugerencias del POS
    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const agregarAlCarrito = (e) => {
        e.preventDefault();
        if (!productoSeleccionado) return alert("Por favor, selecciona un producto usando el buscador.");

        if (productoSeleccionado.stockActual < cantidadSel) {
            alert(`No hay suficiente stock. Solo quedan ${productoSeleccionado.stockActual} unidades.`);
            return;
        }

        const existe = carrito.find(item => item.producto.id === productoSeleccionado.id);
        if (existe) {
            if (productoSeleccionado.stockActual < (existe.cantidad + parseInt(cantidadSel))) {
                alert("La cantidad acumulada supera el stock disponible.");
                return;
            }
            setCarrito(carrito.map(item =>
                item.producto.id === productoSeleccionado.id
                    ? { ...item, cantidad: item.cantidad + parseInt(cantidadSel) }
                    : item
            ));
        } else {
            setCarrito([...carrito, {
                producto: { id: productoSeleccionado.id, nombre: productoSeleccionado.nombre, precioVenta: productoSeleccionado.precioVenta },
                cantidad: parseInt(cantidadSel)
            }]);
        }

        // Resetear buscador
        setProductoSeleccionado(null);
        setBusqueda('');
        setCantidadSel(1);
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.producto.id !== id));
    };

    const calcularTotalCarrito = () => {
        return carrito.reduce((acc, item) => acc + (item.producto.precioVenta * item.cantidad), 0);
    };

    const procesarVenta = async () => {
        if (carrito.length === 0) return;
        try {
            const respuesta = await ventasService.registrarVenta(carrito);
            setBoletaFinal(respuesta.data);
            setCarrito([]);
            await cargarProductos();
            alert("¡Venta procesada con éxito!");
        } catch (error) {
            alert("Error al descontar stock en el servidor.");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
            <h2>🛒 Punto de Venta (POS)</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>

                {/* COLUMNA IZQUIERDA: BUSCADOR INTELIGENTE */}
                <div>
                    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                        <h3 style={{ marginTop: 0 }}>Escanear o Buscar Artículo</h3>
                        <form onSubmit={agregarAlCarrito} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                                <label>Producto:</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 10px' }}>
                                    <Search size={18} color="#666" style={{ marginRight: '8px' }} />
                                    <input
                                        type="text"
                                        placeholder="Escribe el artículo... (Ej: clo o pap)"
                                        value={busqueda}
                                        onChange={(e) => {
                                            setBusqueda(e.target.value);
                                            setMostrarSugerencias(true);
                                            if (productoSeleccionado) setProductoSeleccionado(null);
                                        }}
                                        onFocus={() => setMostrarSugerencias(true)}
                                        style={{ width: '100%', padding: '6px', border: 'none', outline: 'none', fontSize: '15px' }}
                                    />
                                </div>

                                {/* Desplegable dinámico */}
                                {mostrarSugerencias && busqueda && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                        {productosFiltrados.length === 0 ? (
                                            <div style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>No hay coincidencias</div>
                                        ) : (
                                            productosFiltrados.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        setProductoSeleccionado(p);
                                                        setBusqueda(`${p.nombre} — $${p.precioVenta} (Dispo: ${p.stockActual})`);
                                                        setMostrarSugerencias(false);
                                                    }}
                                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', background: p.stockActual <= 0 ? '#f8d7da' : '#fff' }}
                                                    onMouseEnter={(e) => e.target.style.background = '#f1f1f1'}
                                                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                                                >
                                                    <strong>{p.nombre}</strong> <small style={{color: '#2e7d32'}}>— ${p.precioVenta}</small> <small style={{color: '#666'}}>(Quedan: {p.stockActual})</small>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label>Cantidad a Vender:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={cantidadSel}
                                    onChange={(e) => setCantidadSel(e.target.value)}
                                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <button type="submit" style={{ padding: '12px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                                Añadir a la Boleta
                            </button>
                        </form>
                    </div>

                    {/* VISTA DE BOLETA EMITIDA */}
                    {boletaFinal && (
                        <div style={{ marginTop: '20px', padding: '20px', background: '#d1e7dd', color: '#0f5132', borderRadius: '8px', border: '1px solid #badbcc' }}>
                            <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 color="green"/> ¡Venta Exitosa Boleta N° {boletaFinal.id}!
                            </h4>
                            <p style={{ margin: '2px 0' }}><small>Fecha: {new Date(boletaFinal.fecha).toLocaleString()}</small></p>
                            <hr style={{ borderColor: '#badbcc' }}/>
                            <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                                {boletaFinal.detalles?.map(d => (
                                    <li key={d.id}>{d.producto?.nombre} x {d.cantidad} un. — <strong>${(d.precioUnitario * d.cantidad).toLocaleString()}</strong></li>
                                ))}
                            </ul>
                            <h4 style={{ margin: '10px 0 0 0' }}>Total Cobrado: ${boletaFinal.total.toLocaleString()}</h4>
                        </div>
                    )}
                </div>

                {/* COLUMNA DERECHA: CARRITO */}
                <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart /> Detalle de la Venta Actual</h3>
                    {carrito.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>Boleta vacía. Busca un artículo arriba.</p>
                    ) : (
                        <>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                                        <th style={{ padding: '8px' }}>Producto</th>
                                        <th style={{ padding: '8px', textAlign: 'center' }}>Cant.</th>
                                        <th style={{ padding: '8px', textAlign: 'right' }}>Subtotal</th>
                                        <th style={{ padding: '8px', textAlign: 'center' }}>Quitar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carrito.map(item => (
                                        <tr key={item.producto.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '8px' }}>{item.producto.nombre}</td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>{item.cantidad}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>${(item.producto.precioVenta * item.cantidad).toLocaleString()}</td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                                <button onClick={() => eliminarDelCarrito(item.producto.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #ccc', paddingTop: '15px' }}>
                                <h3>TOTAL:</h3>
                                <h2 style={{ color: '#198754', margin: 0 }}>${calcularTotalCarrito().toLocaleString()}</h2>
                            </div>
                            <button onClick={procesarVenta} style={{ width: '100%', marginTop: '15px', padding: '15px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Confirmar Venta
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}