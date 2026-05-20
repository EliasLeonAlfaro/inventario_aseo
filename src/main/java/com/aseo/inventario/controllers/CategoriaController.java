package com.aseo.inventario.controllers;

import com.aseo.inventario.entities.Categoria;
import com.aseo.inventario.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Le dice a Spring que esto es una API REST (devuelve JSON)
@RequestMapping("/api/categorias") // La ruta base para este controlador
@CrossOrigin(origins = "*") // Permite que React (en otro puerto) se conecte sin problemas de bloqueo
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // 1. Obtener todas las categorías -> GET http://localhost:8080/api/categorias
    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    // 2. Crear una nueva categoría -> POST http://localhost:8080/api/categorias
    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
}