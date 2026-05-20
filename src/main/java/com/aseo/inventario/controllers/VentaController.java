package com.aseo.inventario.controllers;

import com.aseo.inventario.entities.DetalleVenta;
import com.aseo.inventario.entities.Venta;
import com.aseo.inventario.services.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    // Registrar una venta -> POST http://localhost:8080/api/ventas
    @PostMapping
    public Venta crearVenta(@RequestBody List<DetalleVenta> detalles) {
        return ventaService.registrarVenta(detalles);
    }

    // 🔥 NUEVO: Listar todas las ventas para el historial -> GET http://localhost:8080/api/ventas
    @GetMapping
    public List<Venta> listarTodas() {
        return ventaService.obtenerTodasLasVentas();
    }

}