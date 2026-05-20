package com.aseo.inventario;

import com.aseo.inventario.entities.Categoria;
import com.aseo.inventario.repositories.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class InventarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventarioApplication.class, args);
	}

	// 🔥 ESTE BLOQUE CREA EL BANCO DE CATEGORÍAS AUTOMÁTICAMENTE
	@Bean
	public CommandLineRunner precargarCategorias(CategoriaRepository categoriaRepository) {
		return args -> {
			// Si ya hay categorías creadas, no hace nada para no duplicar
			if (categoriaRepository.count() == 0) {
				List<String> categoriasPopulares = Arrays.asList(
						"Líquidos y Desinfectantes",
						"Detergentes y Lavandería",
						"Lavaloza y Cocina",
						"Papeles de Limpieza",
						"Útiles de Aseo (Herramientas)",
						"Aseo Personal y Jabones",
						"Aromatizadores y Ambientadores"
				);

				for (String nombre : categoriasPopulares) {
					Categoria cat = new Categoria();
					cat.setNombre(nombre);
					categoriaRepository.save(cat);
				}

				System.out.println("¡Banco de categorías populares cargado con éxito en MySQL!");
			}
		};
	}
}