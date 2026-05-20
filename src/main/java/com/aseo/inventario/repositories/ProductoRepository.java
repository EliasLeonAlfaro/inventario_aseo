package com.aseo.inventario.repositories;

import com.aseo.inventario.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Al igual que el anterior, maneja todos los procesos básicos de la tabla productos
}