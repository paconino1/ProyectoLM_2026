/**
 * shop.js - Lógica específica de la página de tienda
 */

let allGames = [];

// Cargar juegos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupFilters();
});

/**
 * Carga todos los juegos de la API
 */
async function loadGames() {
    const grid = document.getElementById('games-grid');
    
    try {
        const games = await getAllJuegos();
        
        if (!games || games.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No hay juegos disponibles.</p>';
            return;
        }
        
        allGames = games;
        displayGames(games);
        
        // Agregar event listeners a las tarjetas
        setupGameCardListeners();
        
    } catch (error) {
        console.error('Error al cargar juegos:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #e74c3c;">Error al cargar juegos.</p>';
    }
}

/**
 * Muestra los juegos en la grid
 */
function displayGames(games) {
    const grid = document.getElementById('games-grid');
    
    if (games.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No se encontraron resultados.</p>';
        return;
    }
    
    grid.innerHTML = games.map(game => createGameCard(game)).join('');
    setupGameCardListeners();
}

/**
 * Configura event listeners para tarjetas de juegos
 */
function setupGameCardListeners() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const gameId = e.currentTarget.dataset.gameId;
            const game = allGames.find(g => g.id == gameId);
            if (game) {
                showGameModal(game);
            }
        });
    });
}

/**
 * Configura los filtros
 */
function setupFilters() {
    // Filtro de plataforma
    const platformFilter = document.getElementById('platform-filter');
    if (platformFilter) {
        platformFilter.addEventListener('change', applyFilters);
    }

    // Filtro de ordenamiento
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }

    // Búsqueda
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Aplicar filtro de URL si existe
    const platformParam = getQueryParam('platform');
    if (platformParam && platformFilter) {
        platformFilter.value = platformParam;
        applyFilters();
    }
}

/**
 * Aplica todos los filtros activos
 */
function applyFilters() {
    let filtered = [...allGames];

    // Filtro por plataforma
    const platformFilter = document.getElementById('platform-filter');
    const selectedPlatform = platformFilter?.value;
    if (selectedPlatform) {
        filtered = filtered.filter(game => game.plataforma === selectedPlatform);
    }

    // Filtro de búsqueda
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput?.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(game => 
            game.nombre.toLowerCase().includes(searchTerm) ||
            game.descripcion?.toLowerCase().includes(searchTerm)
        );
    }

    // Ordenamiento
    const priceFilter = document.getElementById('price-filter');
    const sortOrder = priceFilter?.value;
    
    if (sortOrder === 'price-asc') {
        filtered.sort((a, b) => (a.precioConDescuento || a.precio) - (b.precioConDescuento || b.precio));
    } else if (sortOrder === 'price-desc') {
        filtered.sort((a, b) => (b.precioConDescuento || b.precio) - (a.precioConDescuento || a.precio));
    } else if (sortOrder === 'discount') {
        filtered.sort((a, b) => (b.descuento || 0) - (a.descuento || 0));
    } else if (sortOrder === 'name') {
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    displayGames(filtered);
}

/**
 * Busca juegos (alternativa: usar API si el backend lo soporta)
 */
async function searchGames(query) {
    if (!query.trim()) {
        displayGames(allGames);
        return;
    }

    const results = await searchJuegos(query);
    
    if (results) {
        allGames = results;
        displayGames(results);
    }
}
