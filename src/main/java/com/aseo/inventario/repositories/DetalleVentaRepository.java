package com.aseo.inventario.repositories;

import com.aseo.inventario.dto.ProductoMasVendidoDTO;
import com.aseo.inventario.entities.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

    // Esta consulta junta los detalles con las ventas, filtra por fechas, agrupa por producto,
    // suma las cantidades y nos da el ranking de los más vendidos de mayor a menor.
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
}