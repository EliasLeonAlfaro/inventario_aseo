package com.aseo.inventario.repositories;

import com.aseo.inventario.entities.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    // Al heredar de JpaRepository<Venta, Long>, Java ya sabe que
    // este repositorio maneja únicamente la entidad 'Venta' y que su ID es tipo 'Long'.
}