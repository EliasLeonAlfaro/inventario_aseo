package com.aseo.inventario.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categorias")
@Data // Esto genera los getters y setters automáticamente gracias a Lombok
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;
}