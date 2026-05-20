package com.aseo.inventario.repositories;

import com.aseo.inventario.dto.ProductoMasVendidoDTO;
import com.aseo.inventario.dto.GananciaProductoDTO;
import com.aseo.inventario.entities.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    // 1. REPORTE DE UNIDADES (El que se había borrado)
    @Query("SELECT new com.aseo.inventario.dto.ProductoMasVendidoDTO(p.nombre, SUM(d.cantidad)) " +
            "FROM DetalleVenta d " +
            "JOIN d.venta v " +
            "JOIN d.producto p " +
            "WHERE v.fecha BETWEEN :inicio AND :fin " +
            "GROUP BY p.nombre " +
            "ORDER BY SUM(d.cantidad) DESC")
    List<ProductoMasVendidoDTO> obtenerProductosMasVendidosEnRango(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );

    // 2. REPORTE DE GANANCIAS FINANCIERAS
    @Query("SELECT new com.aseo.inventario.dto.GananciaProductoDTO(" +
            "p.nombre, SUM(d.cantidad), SUM(d.cantidad * d.precioUnitario), " +
            "SUM(d.cantidad * (d.precioUnitario - d.costoUnitarioMomento)), " +
            "AVG(d.precioUnitario), AVG(d.costoUnitarioMomento)) " + // 🔥 Agregamos los promedios unitarios
            "FROM DetalleVenta d " +
            "JOIN d.venta v " +
            "JOIN d.producto p " +
            "WHERE v.fecha BETWEEN :inicio AND :fin " +
            "GROUP BY p.nombre " +
            "ORDER BY SUM(d.cantidad * (d.precioUnitario - d.costoUnitarioMomento)) DESC")
    List<GananciaProductoDTO> obtenerGananciasPorRango(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );
}