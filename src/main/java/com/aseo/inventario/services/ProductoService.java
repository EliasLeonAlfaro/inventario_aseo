package com.aseo.inventario.services;

import com.aseo.inventario.entities.Producto;
import com.aseo.inventario.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service // Le dice a Spring que esta clase maneja la lógica del negocio
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository; // Inyectamos el repositorio para usar la BD

    // 1. Método para listar todos los productos (Ideal para mostrarlos en React)
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    // 2. Método para registrar un producto por primera vez
    public Producto guardarProducto(Producto producto) {
        // Al crearse por primera vez, su costo ponderado inicial es igual al precio de compra inicial
        return productoRepository.save(producto);
    }

    // 3. ¡EL MOTOR MATEMÁTICO! Registrar compras nuevas y ponderar costos
    @Transactional // Si algo falla en el proceso, deshace los cambios en la BD para evitar errores
    public Producto registrarCompraMercaderia(Long productoId, Integer cantidadComprada, Double precioCompraNuevo) {

        // Buscamos el producto. Si no existe, lanza un error controlado.
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("El producto con ID " + productoId + " no existe."));

        // Extraemos los datos actuales antes de la nueva compra
        Integer stockActual = producto.getStockActual();
        Double costoPonderadoActual = producto.getCostoPonderado();

        // Aplicamos la fórmula del Costo Medio Ponderado (CMP)
        Double inversionPasada = stockActual * costoPonderadoActual;
        Double inversionNueva = cantidadComprada * precioCompraNuevo;

        Integer nuevoStockTotal = stockActual + cantidadComprada;
        Double nuevoCostoPonderado = (inversionPasada + inversionNueva) / nuevoStockTotal;

        // Seteamos los nuevos valores calculados en el objeto producto
        producto.setStockActual(nuevoStockTotal);
        producto.setCostoPonderado(nuevoCostoPonderado);

        // Guardamos los cambios actualizados en la base de datos
        return productoRepository.save(producto);
    }
}