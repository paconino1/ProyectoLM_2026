package com.eneba.service;

import com.eneba.entity.Juego;
import com.eneba.repository.JuegoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service: JuegoService
 * 
 * Contiene la lógica de negocio para operaciones con Juegos.
 * 
 * @Service: Indica que es un servicio (caso especial de @Component)
 * @RequiredArgsConstructor: Genera automáticamente el constructor con campos final
 * @Slf4j: Proporciona un logger automático (log)
 * @Transactional: Maneja transacciones de BD automáticamente
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class JuegoService {

    // Se inyecta automáticamente gracias a @RequiredArgsConstructor
    private final JuegoRepository juegoRepository;

    /**
     * Obtiene todos los juegos
     */
    public List<Juego> obtenerTodos() {
        log.info("Obteniendo todos los juegos");
        return juegoRepository.findAll();
    }

    /**
     * Obtiene un juego por ID
     */
    public Optional<Juego> obtenerPorId(Long id) {
        log.info("Buscando juego con ID: {}", id);
        return juegoRepository.findById(id);
    }

    /**
     * Obtiene juegos de una plataforma específica
     */
    public List<Juego> obtenerPorPlataforma(String plataforma) {
        log.info("Buscando juegos para plataforma: {}", plataforma);
        return juegoRepository.findByPlataforma(plataforma);
    }

    /**
     * Obtiene juegos disponibles (con stock) de una plataforma
     */
    public List<Juego> obtenerDisponiblesPorPlataforma(String plataforma) {
        log.info("Buscando juegos disponibles para plataforma: {}", plataforma);
        return juegoRepository.findDisponiblesByPlataforma(plataforma);
    }

    /**
     * Obtiene juegos con descuento
     */
    public List<Juego> obtenerConDescuento() {
        log.info("Obteniendo juegos con descuento");
        return juegoRepository.findConDescuento();
    }

    /**
     * Busca juegos por término (nombre o descripción)
     */
    public List<Juego> buscar(String termino) {
        log.info("Buscando juegos con término: {}", termino);
        if (termino == null || termino.isEmpty()) {
            return obtenerTodos();
        }
        return juegoRepository.buscarPorTermino(termino);
    }

    /**
     * Obtiene los últimos juegos añadidos
     */
    public List<Juego> obtenerUltimos() {
        log.info("Obteniendo últimos juegos añadidos");
        return juegoRepository.findUltimosJuegos();
    }

    /**
     * Crea un nuevo juego
     * @Transactional asegura que si algo falla, la transacción se revierta
     */
    @Transactional
    public Juego crear(Juego juego) {
        log.info("Creando nuevo juego: {}", juego.getNombre());

        // Validaciones básicas
        if (juego.getNombre() == null || juego.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre del juego es requerido");
        }

        if (juego.getPlataforma() == null || juego.getPlataforma().isEmpty()) {
            throw new IllegalArgumentException("La plataforma es requerida");
        }

        if (juego.getPrecio() == null || juego.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }

        if (juego.getStock() == null || juego.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }

        // Verificar que no exista un juego con el mismo nombre
        if (juegoRepository.findByNombre(juego.getNombre()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un juego con ese nombre");
        }

        return juegoRepository.save(juego);
    }

    /**
     * Actualiza un juego existente
     */
    @Transactional
    public Juego actualizar(Long id, Juego juegoActualizado) {
        log.info("Actualizando juego con ID: {}", id);

        Juego juego = juegoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Juego no encontrado con ID: " + id));

        // Actualizar campos
        if (juegoActualizado.getNombre() != null) {
            juego.setNombre(juegoActualizado.getNombre());
        }
        if (juegoActualizado.getDescripcion() != null) {
            juego.setDescripcion(juegoActualizado.getDescripcion());
        }
        if (juegoActualizado.getPrecio() != null) {
            juego.setPrecio(juegoActualizado.getPrecio());
        }
        if (juegoActualizado.getDescuento() != null) {
            juego.setDescuento(juegoActualizado.getDescuento());
        }
        if (juegoActualizado.getStock() != null) {
            juego.setStock(juegoActualizado.getStock());
        }
        if (juegoActualizado.getImagen() != null) {
            juego.setImagen(juegoActualizado.getImagen());
        }

        return juegoRepository.save(juego);
    }

    /**
     * Elimina un juego
     */
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando juego con ID: {}", id);

        if (!juegoRepository.existsById(id)) {
            throw new IllegalArgumentException("Juego no encontrado con ID: " + id);
        }

        juegoRepository.deleteById(id);
    }

    /**
     * Reduce el stock de un juego (cuando se compra)
     */
    @Transactional
    public void reducirStock(Long id, Integer cantidad) {
        log.info("Reduciendo stock del juego {} en {}", id, cantidad);

        Juego juego = juegoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Juego no encontrado"));

        if (juego.getStock() < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente: disponible " + juego.getStock());
        }

        juego.setStock(juego.getStock() - cantidad);
        juegoRepository.save(juego);
    }

    /**
     * Cuenta el número total de juegos
     */
    public Long contar() {
        return juegoRepository.count();
    }
}
