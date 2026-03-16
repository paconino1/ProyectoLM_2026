package com.eneba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity: Juego
 * 
 * Representa un videojuego en la base de datos.
 * 
 * @Entity: Indica que esta clase será una tabla en la BD
 * @Table: Nombre de la tabla (opcional, por defecto es el nombre de la clase)
 * 
 * Lombok (@Data, @NoArgsConstructor, @AllArgsConstructor):
 * - @Data: Genera getters, setters, toString(), equals(), hashCode()
 * - @NoArgsConstructor: Constructor sin parámetros
 * - @AllArgsConstructor: Constructor con todos los parámetros
 */
@Entity
@Table(name = "juegos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Juego {

    /**
     * ID único del juego
     * @Id: Clave primaria
     * @GeneratedValue: Se auto-incrementa
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre del juego
     * @Column: Configuración de la columna
     * unique = true: No puede haber dos juegos con el mismo nombre
     */
    @Column(nullable = false, unique = true)
    private String nombre;

    /**
     * Descripción del juego
     */
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /**
     * Plataforma (PC, PlayStation, Xbox, Nintendo, etc.)
     */
    @Column(nullable = false)
    private String plataforma;

    /**
     * Género (Acción, RPG, Estrategia, etc.)
     */
    private String genero;

    /**
     * Precio original sin descuento
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    /**
     * Descuento en porcentaje (0-100)
     */
    private Integer descuento; // 0-100%

    /**
     * Stock disponible
     */
    @Column(nullable = false)
    private Integer stock;

    /**
     * URL de la imagen del juego
     */
    private String imagen;

    /**
     * Developer (desarrollador)
     */
    private String desarrollador;

    /**
     * Desarrollador (publisher)
     */
    private String editor;

    /**
     * Fecha de lanzamiento
     */
    private String fechaLanzamiento;

    /**
     * Calificación (1-5 estrellas)
     */
    private Double calificacion;

    /**
     * Fecha de creación en la BD
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    /**
     * Fecha de última actualización
     */
    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;

    /**
     * Antes de guardar por primera vez en la BD
     */
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        if (descuento == null) {
            descuento = 0;
        }
    }

    /**
     * Antes de cada actualización
     */
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    /**
     * Calcula el precio con descuento aplicado
     */
    public BigDecimal getPrecioConDescuento() {
        if (descuento == null || descuento == 0) {
            return precio;
        }
        BigDecimal porcentaje = BigDecimal.valueOf(100 - descuento).divide(BigDecimal.valueOf(100));
        return precio.multiply(porcentaje);
    }
}
