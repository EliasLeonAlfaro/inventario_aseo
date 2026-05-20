import React, { useState, useEffect } from 'react';
import { reportesService } from '../services/api';
import { Calendar, BarChart3, DollarSign } from 'lucide-react';

export default function Reportes() {
    const [tipoReporte, setTipoReporte] = useState('semanal');
    const [ranking, setRanking] = useState([]);
    const [ganancias, setGanancias] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        obtenerDatosReporte();
    }, [tipoReporte]);

    const obtenerDatosReporte = async () => {
        setCargando(true);
        try {
            const resEstrella = await reportesService.obtenerProductoEstrella(tipoReporte);
            const resGanancias = await reportesService.obtenerGanancias(tipoReporte);
            setRanking(resEstrella.data);
            setGanancias(resGanancias.data);
        } catch (error) {
            console.error(error);
            alert("Error al conectar con los reportes financieros.");
        } finally {
            setCargando(false);
        }
    };

    // Sumar la ganancia total de todas las filas para saber cuánto ganaste en el día/semana
    const calcularGananciaTotalPeriodo = () => {
        return ganancias.reduce((acc, item) => acc + item.gananciaReal, 0);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
            <h2>📊 Informes Comerciales y Utilidad Real</h2>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '20px' }}>
                {['semanal', 'mensual', 'anual'].map((p) => (
                    <button key={p} onClick={() => setTipoReporte(p)} style={{ padding: '10px 20px', textTransform: 'capitalize', backgroundColor: tipoReporte === p ? '#0d6efd' : '#f8f9fa', color: tipoReporte === p ? 'white' : '#333', border: '1px solid #dee2e6', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {p}
                    </button>
                ))}
            </div>

            {/* 🔥 TARJETA RESUMEN DE GANANCIA NETAA */}
            <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', padding: '20px', borderRadius: '8px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#2e7d32', padding: '12px', borderRadius: '50%', color: 'white' }}><DollarSign size={30} /></div>
                <div>
                    <h3 style={{ margin: 0, color: '#1b5e20' }}>Ganancia Neta Real del Periodo</h3>
                    <h1 style={{ margin: '5px 0 0 0', color: '#2e7d32' }}>${calcularGananciaTotalPeriodo().toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
                {/* IZQUIERDA: RANKING UNIDADES */}
                <div style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0 }}><BarChart3 size={18} /> Ranking de Unidades</h3>
                    {ranking.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8f9fa', marginBottom: '8px', borderRadius: '4px' }}>
                            <span>#{i+1} <strong>{item.nombreProducto}</strong></span>
                            <span style={{ fontWeight: 'bold', color: '#0d6efd' }}>{item.cantidadTotal} un.</span>
                        </div>
                    ))}
                </div>

                {/* DERECHA: DESGLOSE DETALLADO DE GANANCIAS */}
                <div style={{ border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0 }}><DollarSign size={18} /> Desglose de Utilidad por Artículo</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px 5px' }}>Producto</th>
                                <th style={{ textAlign: 'center' }}>Cant.</th>
                                <th style={{ textAlign: 'right' }}>Costo (CMP)</th>
                                <th style={{ textAlign: 'right' }}>P. Venta</th>
                                <th style={{ textAlign: 'right' }}>Gan. Unit.</th>
                                <th style={{ textAlign: 'right' }}>Gan. Total</th>
                                <th style={{ textAlign: 'right', paddingRight: '5px' }}>Venta Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ganancias.map((item, i) => {
                                // Matemáticas transparentes por cada fila
                                const gananciaUnitario = item.precioVentaUnitario - item.costoPonderadoUnitario;

                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px 5px' }}><strong>{item.nombreProducto}</strong></td>
                                        <td style={{ textAlign: 'center' }}>{item.cantidadVendida} un.</td>
                                        <td style={{ textAlign: 'right', color: '#666' }}>${item.costoPonderadoUnitario.toLocaleString()}</td>
                                        <td style={{ textAlign: 'right', color: '#0d6efd' }}>${item.precioVentaUnitario.toLocaleString()}</td>
                                        <td style={{ textAlign: 'right', color: '#157347', fontWeight: '500' }}>
                                            +${gananciaUnitario.toLocaleString()}
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}>
                                            +${item.gananciaReal.toLocaleString()}
                                        </td>
                                        {/* 🔥 NUEVA COLUMNA: Aquí pintamos el ingreso bruto total del producto */}
                                        <td style={{ textAlign: 'right', fontWeight: '600', color: '#212529', paddingRight: '5px' }}>
                                            ${item.totalVendido.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}