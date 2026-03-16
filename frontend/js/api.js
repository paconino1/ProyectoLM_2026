/**
 * api.js - Funciones para comunicar con la API REST del Backend
 * 
 * NOTA: Cambiar la URL base según dónde esté desplegado el backend
 * - Desarrollo: http://localhost:8080
 * - Producción: https://mi-backend.railway.app (o similar)
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Realiza una petición GET a la API
 * @param {string} endpoint - Ruta del endpoint (ej: /juegos)
 * @returns {Promise} Datos en formato JSON
 */
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include' // Para enviar cookies si hay autenticación
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en GET ${endpoint}:`, error);
        return null;
    }
}

/**
 * Realiza una petición POST a la API
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} data - Datos a enviar
 * @returns {Promise} Datos en formato JSON
 */
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en POST ${endpoint}:`, error);
        return null;
    }
}

/**
 * Realiza una petición PUT a la API
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} data - Datos a actualizar
 * @returns {Promise} Datos en formato JSON
 */
async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en PUT ${endpoint}:`, error);
        return null;
    }
}

/**
 * Realiza una petición DELETE a la API
 * @param {string} endpoint - Ruta del endpoint
 * @returns {Promise} Respuesta
 */
async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en DELETE ${endpoint}:`, error);
        return null;
    }
}

/* ==========================================
   ENDPOINTS ESPECÍFICOS
   ========================================== */

/**
 * Obtiene todos los juegos
 */
async function getAllJuegos() {
    return await apiGet('/juegos');
}

/**
 * Obtiene un juego por ID
 */
async function getJuegoById(id) {
    return await apiGet(`/juegos/${id}`);
}

/**
 * Obtiene juegos por plataforma
 */
async function getJuegosByPlatform(platform) {
    return await apiGet(`/juegos/platform/${platform}`);
}

/**
 * Busca juegos por nombre
 */
async function searchJuegos(query) {
    return await apiGet(`/juegos/search?q=${encodeURIComponent(query)}`);
}

/**
 * Crea un nuevo juego (solo admin)
 */
async function createJuego(data) {
    return await apiPost('/juegos', data);
}

/**
 * Actualiza un juego (solo admin)
 */
async function updateJuego(id, data) {
    return await apiPut(`/juegos/${id}`, data);
}

/**
 * Elimina un juego (solo admin)
 */
async function deleteJuego(id) {
    return await apiDelete(`/juegos/${id}`);
}

/**
 * Obtiene todas las compras del usuario
 */
async function getUserCompras() {
    return await apiGet('/compras/mis-compras');
}

/**
 * Crea una nueva compra
 */
async function createCompra(data) {
    return await apiPost('/compras', data);
}

/**
 * Autentica al usuario (login)
 */
async function login(email, password) {
    return await apiPost('/auth/login', { email, password });
}

/**
 * Registra un nuevo usuario
 */
async function register(data) {
    return await apiPost('/auth/register', data);
}

/**
 * Cierra sesión del usuario
 */
async function logout() {
    return await apiPost('/auth/logout', {});
}

/**
 * Obtiene el perfil del usuario autenticado
 */
async function getUserProfile() {
    return await apiGet('/usuarios/perfil');
}

/**
 * Contacta con el chatbot de soporte
 */
async function chatbotMessage(message) {
    return await apiPost('/chatbot/mensaje', { mensaje: message });
}
