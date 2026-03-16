package com.eneba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * EnebaApplication - Clase principal de la aplicación Spring Boot
 * 
 * @SpringBootApplication combina:
 * - @Configuration: Indica que es una clase de configuración
 * - @EnableAutoConfiguration: Activa la configuración automática
 * - @ComponentScan: Escanea componentes en este paquete y subpaquetes
 */
@SpringBootApplication
public class EnebaApplication {

    public static void main(String[] args) {
        // Inicia la aplicación Spring Boot
        SpringApplication.run(EnebaApplication.class, args);
    }

    /**
     * Configuración de CORS (Cross-Origin Resource Sharing)
     * Permite que el frontend (HTML/JS) pueda hacer peticiones a esta API
     * 
     * Sin esto, el navegador bloqueará las peticiones desde otros dominios
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:3000",
                            "http://localhost:8080",
                            "http://127.0.0.1:3000",
                            "http://127.0.0.1:8080"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
