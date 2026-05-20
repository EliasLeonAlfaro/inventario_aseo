package com.aseo.inventario.repositories;

import com.aseo.inventario.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // Al heredar (extends) de JpaRepository, automáticamente ganamos métodos como:
    // save(), findById(), findAll(), deleteById(), etc.
    // El 'Categoria' es la entidad, y 'Long' es el tipo de dato de su ID.
}