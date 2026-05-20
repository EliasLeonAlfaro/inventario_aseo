package com.aseo.inventario.controllers;

import com.aseo.inventario.entities.Producto;
import com.aseo.inventario.services.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // 1. Listar todos los productos -> GET http://localhost:8080/api/productos
    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.obtenerTodos();
    }

    // 2. Guardar un producto nuevo -> POST http://localhost:8080/api/productos
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.guardarProducto(producto);
    }

    // 3. Registrar nueva compra (Recalcula Stock y Costo Ponderado)
    // -> PUT http://localhost:8080/api/productos/1/comprar?cantidad=20&precioCompra=990
    @PutMapping("/{id}/comprar")
    public Producto comprarMercaderia(
            @PathVariable Long id,
            @RequestParam Integer cantidad,
            @RequestParam Double precioCompra) {

        return productoService.registrarCompraMercaderia(id, cantidad, precioCompra);
    }
}