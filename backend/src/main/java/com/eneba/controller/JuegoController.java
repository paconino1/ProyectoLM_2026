package com.eneba.controller;

import com.eneba.entity.Juego;
import com.eneba.service.JuegoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller: JuegoController
 * 
 * Expone endpoints REST para operaciones con Juegos.
 * 
 * @RestController: Combina @Controller + @ResponseBody
 *                  Cada método retorna automáticamente JSON
 * @RequestMapping: Define la ruta base para todos los endpoints
 * @RequiredArgsConstructor: Inyecta automáticamente JuegoService
 * 
 * Rutas disponibles:
 * GET    /api/juegos              - Obtener todos
 * GET    /api/juegos/{id}         - Obtener por ID
 * GET    /api/juegos/platform/{platform} - Por plataforma
 * GET    /api/juegos/search       - Buscar
 * POST   /api/juegos              - Crear
 * PUT    /api/juegos/{id}         - Actualizar
 * DELETE /api/juegos/{id}         - Eliminar
 */
@RestController
@RequestMapping("/juegos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000") // Permite peticiones desde el frontend
public class JuegoController {

    private final JuegoService juegoService;

    /**
     * GET /api/juegos/health
     * Endpoint de prueba para verificar que el backend responde
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        log.info("GET /juegos/health - Health check");
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/juegos
     * Obtiene todos los juegos
     */
    @GetMapping
    public ResponseEntity<List<Juego>> obtenerTodos() {
        log.info("GET /juegos - Obteniendo todos los juegos");
        try {
            List<Juego> juegos = juegoService.obtenerTodos();
            return ResponseEntity.ok(juegos);
        } catch (Exception e) {
            log.error("Error al obtener juegos", e);
            // Retornar lista vacía en caso de error para desarrollo
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * GET /api/juegos/{id}
     * Obtiene un juego específico por su ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        log.info("GET /juegos/{} - Buscando juego", id);

        Optional<Juego> juego = juegoService.obtenerPorId(id);

        if (juego.isPresent()) {
            return ResponseEntity.ok(juego.get());
        } else {
            // Retornar error 404 si no existe
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearErrorResponse("Juego no encontrado", 404));
        }
    }

    /**
     * GET /api/juegos/platform/{plataforma}
     * Obtiene todos los juegos de una plataforma
     * 
     * NOTA: Este endpoint debe estar ANTES del /api/juegos/{id}
     * porque /platform/{plataforma} es más específico
     */
    @GetMapping("/platform/{plataforma}")
    public ResponseEntity<List<Juego>> obtenerPorPlataforma(@PathVariable String plataforma) {
        log.info("GET /juegos/platform/{} - Buscando por plataforma", plataforma);
        List<Juego> juegos = juegoService.obtenerPorPlataforma(plataforma);
        return ResponseEntity.ok(juegos);
    }

    /**
     * GET /api/juegos/search?q=término
     * Busca juegos por término
     */
    @GetMapping("/search")
    public ResponseEntity<List<Juego>> buscar(@RequestParam(name = "q") String termino) {
        log.info("GET /juegos/search - Buscando con término: {}", termino);
        List<Juego> resultados = juegoService.buscar(termino);
        return ResponseEntity.ok(resultados);
    }

    /**
     * GET /api/juegos/destacados
     * Obtiene juegos con descuento
     */
    @GetMapping("/destacados")
    public ResponseEntity<List<Juego>> obtenerDestacados() {
        log.info("GET /juegos/destacados");
        List<Juego> juegos = juegoService.obtenerConDescuento();
        return ResponseEntity.ok(juegos);
    }

    /**
     * POST /api/juegos
     * Crea un nuevo juego
     * 
     * @RequestBody: Automáticamente convierte JSON a objeto Juego
     * @Valid: Valida las anotaciones @NotNull, @Size, etc. de la entidad
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Juego juego) {
        log.info("POST /juegos - Creando nuevo juego: {}", juego.getNombre());

        try {
            Juego juegoCreado = juegoService.crear(juego);
            return ResponseEntity.status(HttpStatus.CREATED).body(juegoCreado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(crearErrorResponse(e.getMessage(), 400));
        }
    }

    /**
     * PUT /api/juegos/{id}
     * Actualiza un juego existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Juego juegoActualizado) {
        log.info("PUT /juegos/{} - Actualizando", id);

        try {
            Juego juego = juegoService.actualizar(id, juegoActualizado);
            return ResponseEntity.ok(juego);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearErrorResponse(e.getMessage(), 404));
        }
    }

    /**
     * DELETE /api/juegos/{id}
     * Elimina un juego
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        log.info("DELETE /juegos/{} - Eliminando", id);

        try {
            juegoService.eliminar(id);
            return ResponseEntity.ok(crearMensajeResponse("Juego eliminado correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearErrorResponse(e.getMessage(), 404));
        }
    }

    /**
     * GET /api/juegos/stats/cantidad
     * Obtiene el número total de juegos
     */
    @GetMapping("/stats/cantidad")
    public ResponseEntity<Map<String, Object>> obtenerCantidad() {
        log.info("GET /juegos/stats/cantidad");
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJuegos", juegoService.contar());
        return ResponseEntity.ok(stats);
    }

    /**
     * Método auxiliar para crear respuestas de error
     */
    private Map<String, Object> crearErrorResponse(String mensaje, int status) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", mensaje);
        error.put("status", status);
        error.put("timestamp", System.currentTimeMillis());
        return error;
    }

    /**
     * Método auxiliar para crear respuestas de mensaje
     */
    private Map<String, Object> crearMensajeResponse(String mensaje) {
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", mensaje);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
