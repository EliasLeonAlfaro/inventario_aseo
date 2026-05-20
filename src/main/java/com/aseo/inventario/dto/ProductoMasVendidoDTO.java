package com.aseo.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Esto le dice a Lombok que cree el constructor con los campos
public class ProductoMasVendidoDTO {
    private String nombreProducto;
    private Long cantidadTotal;
}