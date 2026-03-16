package com.eneba.repository;

import com.eneba.entity.Juego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository: JuegoRepository
 * 
 * Interfaz que extiende JpaRepository para acceder a los datos de Juego.
 * Spring Boot genera automáticamente la implementación en tiempo de ejecución.
 * 
 * JpaRepository proporciona métodos automáticos:
 * - findAll(): Obtiene todos
 * - findById(id): Obtiene por ID
 * - save(entidad): Guarda o actualiza
 * - delete(entidad): Elimina
 * - deleteById(id): Elimina por ID
 * - count(): Cuenta el número de registros
 * - exists(id): Verifica si existe
 * 
 * Aquí agregamos métodos personalizados usando queries JPQL o SQL nativo
 */
@Repository
public interface JuegoRepository extends JpaRepository<Juego, Long> {

    /**
     * Busca un juego por nombre
     */
    Optional<Juego> findByNombre(String nombre);

    /**
     * Busca todos los juegos de una plataforma
     */
    List<Juego> findByPlataforma(String plataforma);

    /**
     * Busca todos los juegos de un género
     */
    List<Juego> findByGenero(String genero);

    /**
     * Busca juegos con un descuento mayor al especificado
     */
    List<Juego> findByDescuentoGreaterThan(Integer descuento);

    /**
     * Busca juegos cuyo nombre contenga el término (case-insensitive)
     */
    List<Juego> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Query personalizada JPQL para búsqueda avanzada
     * Busca juegos por nombre o descripción
     */
    @Query("SELECT j FROM Juego j WHERE " +
           "LOWER(j.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(j.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Juego> buscarPorTermino(@Param("termino") String termino);

    /**
     * Busca juegos disponibles (stock > 0) de una plataforma
     */
    @Query("SELECT j FROM Juego j WHERE j.plataforma = :plataforma AND j.stock > 0")
    List<Juego> findDisponiblesByPlataforma(@Param("plataforma") String plataforma);

    /**
     * Obtiene juegos con descuento ordenados por mayor descuento
     */
    @Query("SELECT j FROM Juego j WHERE j.descuento > 0 ORDER BY j.descuento DESC")
    List<Juego> findConDescuento();

    /**
     * Obtiene los juegos más nuevos (últimas 10 adiciones)
     */
    @Query(value = "SELECT * FROM juegos ORDER BY fecha_creacion DESC LIMIT 10", 
           nativeQuery = true)
    List<Juego> findUltimosJuegos();
}
