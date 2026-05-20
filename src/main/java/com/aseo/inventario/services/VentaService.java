package com.aseo.inventario.services;

import com.aseo.inventario.entities.DetalleVenta;
import com.aseo.inventario.entities.Producto;
import com.aseo.inventario.entities.Venta;
import com.aseo.inventario.repositories.DetalleVentaRepository;
import com.aseo.inventario.repositories.ProductoRepository;
import com.aseo.inventario.repositories.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentaService {

    // Aquí llamamos a las 3 herramientas por separado
    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public Venta registrarVenta(List<DetalleVenta> detallesCliente) {

        Venta venta = new Venta();
        venta = ventaRepository.save(venta);

        Double totalVenta = 0.0;

        for (DetalleVenta detalle : detallesCliente) {

            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStockActual() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            producto.setStockActual(producto.getStockActual() - detalle.getCantidad());
            productoRepository.save(producto);

            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setPrecioUnitario(producto.getPrecioVenta());
            detalle.setCostoUnitarioMomento(producto.getCostoPonderado());

            totalVenta += detalle.getPrecioUnitario() * detalle.getCantidad();

            // NUEVO: Agregamos el detalle a la lista de la venta en memoria
            venta.getDetalles().add(detalle);

            detalleVentaRepository.save(detalle);
        }

        venta.setTotal(totalVenta);

        return ventaRepository.save(venta);

    }
    // 🔥 NUEVO: Obtener todas las ventas registradas para el historial
    public List<Venta> obtenerTodasLasVentas() {
        return ventaRepository.findAll();
    }
}