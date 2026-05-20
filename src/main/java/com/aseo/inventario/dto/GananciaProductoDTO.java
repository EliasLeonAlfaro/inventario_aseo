package com.aseo.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GananciaProductoDTO {
    private String nombreProducto;
    private Long cantidadVendida;
    private Double totalVendido;
    private Double gananciaReal;
    // 🔥 NUEVOS: Para ver el desglose unitario exacto en la pantalla
    private Double precioVentaUnitario;
    private Double costoPonderadoUnitario;
}