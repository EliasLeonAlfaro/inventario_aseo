package com.aseo.inventario.services;

import com.aseo.inventario.dto.ProductoMasVendidoDTO;
import com.aseo.inventario.repositories.DetalleVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    public List<ProductoMasVendidoDTO> obtenerReporte(String tipo) {
        LocalDateTime fin = LocalDateTime.now();
        LocalDateTime inicio;

        switch (tipo.toLowerCase()) {
            case "semanal":
                inicio = fin.minusDays(7);
                break;
            case "mensual":
                inicio = fin.withDayOfMonth(1).with(LocalTime.MIN);
                break;
            case "anual":
                inicio = fin.withDayOfYear(1).with(LocalTime.MIN);
                break;
            default:
                throw new IllegalArgumentException("Tipo no válido: semanal, mensual o anual.");
        }

        return detalleVentaRepository.obtenerProductosMasVendidosEnRango(inicio, fin);
    }
    public List<com.aseo.inventario.dto.GananciaProductoDTO> obtenerReporteGanancias(String tipo) {
        LocalDateTime fin = LocalDateTime.now();
        LocalDateTime inicio;

        switch (tipo.toLowerCase()) {
            case "semanal": inicio = fin.minusDays(7); break;
            case "mensual": inicio = fin.withDayOfMonth(1).with(LocalTime.MIN); break;
            case "anual": inicio = fin.withDayOfYear(1).with(LocalTime.MIN); break;
            default: throw new IllegalArgumentException("Tipo no válido.");
        }
        return detalleVentaRepository.obtenerGananciasPorRango(inicio, fin);
    }
}
