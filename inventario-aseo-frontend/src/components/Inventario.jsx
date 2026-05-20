import React, { useState, useEffect } from 'react';
import { inventarioService } from '../services/api';
import { AlertTriangle, PlusCircle, PackagePlus, FolderPlus, Search, X } from 'lucide-react';

export default function Inventario() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 🔍 Buscador de Productos (Abastecer)
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // Formulario 1: Registrar Compra
    const [cantidadCompra, setCantidadCompra] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');
    const [procesandoCompra, setProcesandoCompra] = useState(false);

    // Formulario 2: Crear Producto Nuevo
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaDesc, setNuevaDesc] = useState('');
    const [nuevoPrecioVenta, setNuevoPrecioVenta] = useState('');
    const [nuevoCostoInicial, setNuevoCostoInicial] = useState('');
    const [nuevoStockInicial, setNuevoStockInicial] = useState('');
    const [nuevoStockMin, setNuevoStockMin] = useState('');
    const [categoriaSel, setCategoriaSel] = useState('');
    const [procesandoNuevo, setProcesandoNuevo] = useState(false);

    // 🏢 ESTADOS PARA EL BANCO DE CATEGORÍAS FLOTANTE
    const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
    const [categoriaManual, setCategoriaManual] = useState('');

    // Nuestro banco predefinido de categorías para el rubro de aseo
    const bancoCategoriasPopulares = [
        "Líquidos y Desinfectantes",
        "Detergentes y Lavandería",
        "Lavaloza y Cocina",
        "Papeles de Limpieza",
        "Útiles de Aseo (Herramientas)",
        "Aseo Personal y Jabones",
        "Aromatizadores y Ambientadores"
    ];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const resProd = await inventarioService.obtenerProductos();
            const resCat = await inventarioService.obtenerCategorias();
            setProductos(resProd.data);
            setCategorias(resCat.data);
            setCargando(false);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setCargando(false);
        }
    };

    // FUNCIÓN QUE GUARDA LA CATEGORÍA SELECCIONADA EN EL BACKEND
    const guardarCategoria = async (nombre) => {
        if (!nombre || nombre.trim() === "") return;

        // Validar que no exista ya en tu lista actual para no duplicar
        const existe = categorias.some(c => c.nombre.toLowerCase() === nombre.trim().toLowerCase());
        if (existe) {
            alert(`La categoría "${nombre}" ya está en tu menú.`);
            return;
        }

        try {
            await inventarioService.crearCategoria({ nombre: nombre.trim() });
            alert(`¡Categoría "${nombre}" agregada con éxito!`);
            setCategoriaManual('');
            setMostrarModalCategorias(false); // Cerramos el panel
            await cargarDatos(); // Recargar el selector de React
        } catch (error) {
            alert("No se pudo guardar la categoría.");
        }
    };

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    );

    const manejarCompra = async (e) => {
        e.preventDefault();
        if (!productoSeleccionado || !cantidadCompra || !precioCompra) return alert("Completa los campos.");
        setProcesandoCompra(true);
        try {
            await inventarioService.registrarCompra(productoSeleccionado.id, parseInt(cantidadCompra), parseFloat(precioCompra));
            alert("¡Ingreso exitoso!");
            setCantidadCompra(''); setPrecioCompra(''); setProductoSeleccionado(null); setBusquedaProducto('');
            await cargarDatos();
        } catch (error) { alert("Error al procesar ingreso."); }
        setProcesandoCompra(false);
    };

    const manejarCrearProducto = async (e) => {
        e.preventDefault();
        if (!nuevoNombre || !nuevoPrecioVenta || !nuevoCostoInicial || !nuevoStockInicial || !nuevoStockMin || !categoriaSel) {
            return alert("Por favor, llena los campos obligatorios.");
        }
        setProcesandoNuevo(true);
        try {
            const productoDTO = {
                nombre: nuevoNombre,
                descripcion: nuevaDesc,
                precioVenta: parseFloat(nuevoPrecioVenta),
                costoPonderado: parseFloat(nuevoCostoInicial),
                stockActual: parseInt(nuevoStockInicial),
                stockMinimo: parseInt(nuevoStockMin),
                categoria: { id: parseInt(categoriaSel) }
            };
            await inventarioService.crearProducto(productoDTO);
            alert(`¡Producto "${nuevoNombre}" añadido!`);
            setNuevoNombre(''); setNuevoPrecioVenta(''); setNuevoCostoInicial(''); setNuevoStockInicial(''); setNuevoStockMin(''); setCategoriaSel('');
            await cargarDatos();
        } catch (error) { alert("Error al guardar producto."); }
        setProcesandoNuevo(false);
    };

    if (cargando) return <div style={{ padding: '20px' }}>Cargando inventario...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>📋 Gestión de Inventario y Catálogo</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>

                {/* SECCIÓN A: ABASTECER STOCK CON BUSCADOR */}
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0d6efd' }}>
                        <PlusCircle /> Abastecer Stock Existente
                    </h3>
                    <form onSubmit={manejarCompra} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Buscar Producto:</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '2px 8px' }}>
                                <Search size={16} color="#666" style={{ marginRight: '8px' }} />
                                <input
                                    type="text"
                                    placeholder="Escribe para buscar... (Ej: clo)"
                                    value={busquedaProducto}
                                    onChange={(e) => {
                                        setBusquedaProducto(e.target.value);
                                        setMostrarSugerencias(true);
                                    }}
                                    style={{ width: '100%', padding: '6px', border: 'none', outline: 'none' }}
                                />
                            </div>
                            {mostrarSugerencias && busquedaProducto && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                                    {productosFiltrados.map(p => (
                                        <div key={p.id} onClick={() => { setProductoSeleccionado(p); setBusquedaProducto(p.nombre); setMostrarSugerencias(false); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                            {p.nombre} <small style={{color:'#666'}}>(Stock: {p.stockActual})</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <label>Cantidad:</label>
                        <input type="number" min="1" value={cantidadCompra} onChange={(e) => setCantidadCompra(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <label>Precio Unitario de Compra ($):</label>
                        <input type="number" step="0.01" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Registrar Ingreso</button>
                    </form>
                </div>

                {/* SECCIÓN B: CREAR PRODUCTO NUEVO */}
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#198754' }}>
                        <PackagePlus /> Agregar Nuevo Producto al Catálogo
                    </h3>
                    <form onSubmit={manejarCrearProducto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column' }}>
                            <label>Nombre del Producto:</label>
                            <input type="text" placeholder="Ej: Papel Confort 4 un." value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>Precio de Venta ($):</label>
                            <input type="number" value={nuevoPrecioVenta} onChange={(e) => setNuevoPrecioVenta(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>

                        {/* SELECTOR CON EL NUEVO BOTÓN DE BANCO FLOTANTE */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>Categoría:</label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <select value={categoriaSel} onChange={(e) => setCategoriaSel(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
                                    <option value="">-- Elige --</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setMostrarModalCategorias(true)} // Abre el banco de sugerencias
                                    style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    <FolderPlus size={16} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>Costo Inicial ($):</label>
                            <input type="number" value={nuevoCostoInicial} onChange={(e) => setNuevoCostoInicial(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label>Stock Inicial:</label>
                            <input type="number" value={nuevoStockInicial} onChange={(e) => setNuevoStockInicial(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / span 2' }}>
                            <label>Stock Mínimo (Alerta):</label>
                            <input type="number" value={nuevoStockMin} onChange={(e) => setNuevoStockMin(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ gridColumn: '1 / span 2' }}>
                            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Añadir al Catálogo</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 🖥️ VENTANA MODAL EMERGENTE: EL BANCO DE SUGERENCIAS */}
            {mostrarModalCategorias && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '450px', width: '100%', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>💡 Selecciona una Categoría</h3>
                            <button onClick={() => setMostrarModalCategorias(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <p style={{ color: '#666', marginTop: 0, fontSize: '14px' }}>Haz clic en cualquiera de las opciones populares para tu negocio de aseo:</p>

                        {/* BANCO DE CLICS RÁPIDOS */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {bancoCategoriasPopulares.map((cat, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => guardarCategoria(cat)}
                                    style={{ padding: '8px 12px', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
                                >
                                    + {cat}
                                </button>
                            ))}
                        </div>

                        <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '15px' }} />

                        {/* OPCIÓN POR SI QUIERE ESCRIBIR UNA COMPLETAMENTE NUEVA */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>O escribe otra diferente:</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Ej: Ofertas del Mes"
                                    value={categoriaManual}
                                    onChange={(e) => setCategoriaManual(e.target.value)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => guardarCategoria(categoriaManual)}
                                    style={{ padding: '8px 15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Crear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TABLA DE PRODUCTOS */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#e9ecef' }}>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio Venta</th>
                        <th>Costo Ponderado (CMP)</th>
                        <th>Stock Actual</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(prod => {
                        const requiereCompra = prod.stockActual <= prod.stockMinimo;
                        return (
                            <tr key={prod.id} style={{ backgroundColor: requiereCompra ? '#fff3cd' : 'transparent' }}>
                                <td><strong>{prod.nombre}</strong></td>
                                <td>{prod.categoria?.nombre || 'Sin categoría'}</td>
                                <td style={{ textAlign: 'right' }}>${prod.precioVenta.toLocaleString()}</td>
                                <td style={{ textAlign: 'right', color: '#0056b3' }}>${prod.costoPonderado.toFixed(2)}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{prod.stockActual} un.</td>
                                <td>
                                    {requiereCompra ? <span style={{ color: '#856404', fontWeight: 'bold' }}>⚠️ Reordenar (Mín: {prod.stockMinimo})</span> : <span style={{ color: 'green', fontWeight: 'bold' }}>OK</span>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}