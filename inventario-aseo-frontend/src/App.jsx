import React, { useState } from 'react';
import Inventario from './components/Inventario';
import PuntoVenta from './components/PuntoVenta';
import Reportes from './components/Reportes';
import HistorialVentas from './components/HistorialVentas'; // Importamos la nueva pantalla

function App() {
  const [pestana, setPestana] = useState('inventario');

  return (
    <div>
      {/* 🧭 BARRA DE NAVEGACIÓN TOTAL */}
      <nav style={{
        backgroundColor: '#212529',
        padding: '15px 20px',
        display: 'flex',
        gap: '25px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <button
          onClick={() => setPestana('inventario')}
          style={{ background: 'none', border: 'none', color: pestana === 'inventario' ? '#0d6efd' : 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
        >
          📋 Inventario y Costos
        </button>
        <button
          onClick={() => setPestana('venta')}
          style={{ background: 'none', border: 'none', color: pestana === 'venta' ? '#198754' : 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
        >
          🛒 Punto de Venta (POS)
        </button>
        <button
          onClick={() => setPestana('reportes')}
          style={{ background: 'none', border: 'none', color: pestana === 'reportes' ? '#ffc107' : 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
        >
          📊 Reportes Inteligentes
        </button>
        <button
          onClick={() => setPestana('historial')}
          style={{ background: 'none', border: 'none', color: pestana === 'historial' ? '#0dcaf0' : 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} // Celeste
        >
          🗂️ Historial de Ventas
        </button>
      </nav>

      {/* RENDERIZADO COMPORTAMIENTO */}
      {pestana === 'inventario' && <Inventario />}
      {pestana === 'venta' && <PuntoVenta />}
      {pestana === 'reportes' && <Reportes />}
      {pestana === 'historial' && <HistorialVentas />}
    </div>
  );
}

export default App;