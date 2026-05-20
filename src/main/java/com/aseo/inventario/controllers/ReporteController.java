package com.aseo.inventario.controllers;

import com.aseo.inventario.dto.ProductoMasVendidoDTO;
import com.aseo.inventario.services.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*") // Esto permite que React (puerto 5173) hable con Spring (8080)
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/productos-estrella")
    public List<ProductoMasVendidoDTO> obtenerProductosEstrella(@RequestParam String tipo) {
        return reporteService.obtenerReporte(tipo);
    }
    // Endpoint: GET http://localhost:8080/api/reportes/ganancias?tipo=semanal
    @GetMapping("/ganancias")
    public List<com.aseo.inventario.dto.GananciaProductoDTO> obtenerGanancias(@RequestParam String tipo) {
        return reporteService.obtenerReporteGanancias(tipo);
    }
}