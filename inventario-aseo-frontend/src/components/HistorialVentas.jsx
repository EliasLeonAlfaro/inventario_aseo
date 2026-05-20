import React, { useState, useEffect } from 'react';
import { ventasService, inventarioService } from '../services/api';
import { Calendar, Filter, Search, ClipboardList } from 'lucide-react';

export default function HistorialVentas() {
    const [todasLasVentas, setTodasLasVentas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 🎛️ FILTROS EN TIEMPO REAL (ESTADOS)
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        cargarDatosHistorial();
    }, []);

    const cargarDatosHistorial = async () => {
            try {
                // 🔥 CORREGIDO: Ahora usamos tu servicio oficial 'ventasService'
                const resVentas = await ventasService.obtenerVentas();
                const resCat = await inventarioService.obtenerCategorias();

                // Ordenamos el historial para ver las ventas más recientes primero
                const ventasOrdenadas = resVentas.data.sort((a, b) => b.id - a.id);

                setTodasLasVentas(ventasOrdenadas);
                setCategorias(resCat.data);
                setCargando(false);
            } catch (error) {
                console.error("Error cargando historial:", error);
                setCargando(false);
                // Si hay un error, dejamos de mostrar el cartel de "Cargando..." para que no se quede congelado
                alert("No se pudieron cargar las ventas del servidor. Revisa la consola.");
            }
    };

    // 🧪 MOTOR DE FILTRADO CRUZADO EN VIVO (Frontend)
    const ventasFiltradas = todasLasVentas.filter(venta => {
        // 1. Filtro por Fechas
        if (fechaInicio) {
            const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
            if (fechaVenta < fechaInicio) return false;
        }
        if (fechaFin) {
            const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
            if (fechaVenta > fechaFin) return false;
        }

        // Para filtrar por producto o categoría, escaneamos las líneas internas de la boleta
        const cumpleDetalles = venta.detalles.some(det => {
            const coincideTexto = det.producto.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
            const coincideCat = filtroCategoria === '' || (det.producto.categoria && det.producto.categoria.id === parseInt(filtroCategoria));
            return coincideTexto && coincideCat;
        });

        // Si la boleta está vacía (seguridad) o no tiene ningún artículo que califique, se oculta
        if (venta.detalles.length === 0) return false;

        return cumpleDetalles;
    });

    // Calcular la sumatoria de la caja según lo que quedó filtrado en la pantalla
    const calcularTotalRecaudado = () => {
        return ventasFiltradas.reduce((acc, v) => acc + v.total, 0);
    };

    if (cargando) return <div style={{ padding: '20px' }}>Abriendo el libro de historial...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>📋 Historial y Auditoría de Boletas</h2>
            <p style={{ color: '#666' }}>Revisa el flujo de caja diario o busca boletas específicas aplicando filtros en tiempo real.</p>

            {/* 🛠️ BARRA DE FILTROS INTERACTIVA */}
            <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: '500', fontSize: '14px' }}>🔍 Buscar por Artículo:</label>
                    <input
                        type="text"
                        placeholder="Ej: cloro, confort..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: '500', fontSize: '14px' }}>📁 Por Categoría:</label>
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">-- Todas las categorías --</option>
                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: '500', fontSize: '14px' }}>📅 Desde:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: '500', fontSize: '14px' }}>📅 Hasta:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            {/* 💵 CAJA DEL FILTRO ACTUAL */}
            <div style={{ background: '#e3f2fd', color: '#0d47a1', border: '1px solid #bbdefb', padding: '15px 20px', borderRadius: '6px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Suma Total de Boletas Filtradas:</h4>
                <h2 style={{ margin: 0, fontWeight: 'bold' }}>${calcularTotalRecaudado().toLocaleString()}</h2>
            </div>

            {/* 📄 LISTADO DE COMPROBANTES */}
            {ventasFiltradas.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '30px' }}>Ninguna boleta coincide con los criterios de búsqueda seleccionados.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {ventasFiltradas.map(venta => (
                        <div key={venta.id} style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>

                            {/* Cabecera de la boleta */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f1f1', paddingBottom: '10px', marginBottom: '10px' }}>
                                <div>
                                    <span style={{ background: '#212529', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', marginRight: '10px' }}>
                                        Boleta #{venta.id}
                                    </span>
                                    <span style={{ color: '#666', fontSize: '14px' }}>
                                        {new Date(venta.fecha).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#198754' }}>
                                    Total: ${venta.total.toLocaleString()}
                                </div>
                            </div>

                            {/* Desglose de artículos comprados en esta boleta */}
                            <div style={{ paddingLeft: '10px' }}>
                                <table style={{ width: '100%', fontSize: '14px', color: '#495057' }}>
                                    <tbody>
                                        {venta.detalles.map(det => (
                                            <tr key={det.id}>
                                                <td style={{ padding: '4px 0', width: '50%' }}>
                                                    • <strong>{det.producto.nombre}</strong>
                                                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
                                                        ({det.producto.categoria?.nombre || 'Sin categoría'})
                                                    </span>
                                                </td>
                                                <td style={{ padding: '4px 0', textAlign: 'center', color: '#666' }}>
                                                    {det.cantidad} un. x ${det.precioUnitario.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500' }}>
                                                    ${(det.cantidad * det.precioUnitario).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
