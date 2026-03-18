/**
 * main.js - Lógica principal del sitio
 * Gestiona: Carrito, navegación, eventos globales
 */

// ============================================
// CARRITO (Local Storage)
// ============================================

const CART_KEY = "eneba_cart";

/**
 * Obtiene el carrito del localStorage
 */
function getCarrito() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Guarda el carrito en localStorage
 */
function saveCarrito(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

/**
 * Añade un juego al carrito
 */
function addToCart(game) {
  const cart = getCarrito();

  // Verificar si el juego ya está en el carrito
  const existingItem = cart.find((item) => item.id === game.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: game.id,
      nombre: game.nombre,
      precio: game.precioConDescuento || game.precio,
      plataforma: game.plataforma,
      imagen: game.imagen || "assets/default.jpg",
    });
  }

  saveCarrito(cart);
  showNotification(`${game.nombre} añadido al carrito`, "success");
}

/**
 * Elimina un juego del carrito
 */
function removeFromCart(gameId) {
  const cart = getCarrito().filter((item) => item.id !== gameId);
  saveCarrito(cart);
  showNotification("Producto eliminado del carrito", "info");
}

/**
 * Actualiza el número de items en el carrito (badge)
 */
function updateCartCount() {
  const cart = getCarrito();
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const badges = document.querySelectorAll("#cart-count");
  badges.forEach((badge) => {
    badge.textContent = totalCount;
  });
}

/**
 * Calcula el total del carrito
 */
function getCartTotal() {
  const cart = getCarrito();
  return cart.reduce(
    (total, item) => total + item.precio * (item.quantity || 1),
    0,
  );
}

/**
 * Limpia el carrito
 */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

// ============================================
// NOTIFICACIONES
// ============================================

/**
 * Muestra una notificación temporal
 */
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === "success" ? "#10B981" : "#3B82F6"};
        color: white;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

/**
 * Filtra juegos por plataforma
 */
function filterByPlatform(platform) {
  window.location.href = `shop.html?platform=${platform}`;
}

/**
 * Obtiene parámetros de URL
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Actualizar contador del carrito al cargar
  updateCartCount();

  // Navegar a tienda con filtro si se hace clic en categoría
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const platform = e.currentTarget.textContent.match(
        /PC|PlayStation|Xbox|Nintendo/,
      );
      if (platform) {
        filterByPlatform(platform[0]);
      }
    });
  });

  // Botones de login
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("Sistema de autenticación próximamente", "info");
    });
  }

  // Cargar juegos destacados si estamos en home
  if (document.getElementById("featured-games")) {
    loadFeaturedGames();
  }
});

/**
 * Carga juegos destacados en el home
 */
async function loadFeaturedGames() {
  const container = document.getElementById("featured-games");

  try {
    const games = await getAllJuegos();

    if (!games || games.length === 0) {
      container.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: #999;">No hay juegos disponibles.</p>';
      return;
    }

    // Mostrar solo los primeros 8 juegos como destacados
    const featured = games.slice(0, 8);

    container.innerHTML = featured.map((game) => createGameCard(game)).join("");

    // Agregar event listeners a las tarjetas
    document.querySelectorAll(".game-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const gameId = e.currentTarget.dataset.gameId;
        showGameModal(featured.find((g) => g.id == gameId));
      });
    });
  } catch (error) {
    console.error("Error al cargar juegos destacados:", error);
    container.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #e74c3c;">Error al cargar juegos.</p>';
  }
}

/**
 * Crea el HTML de una tarjeta de juego
 */
function createGameCard(game) {
  const discount = game.descuento || 0;
  const imagen = game.imagen || "assets/default.jpg";

  return `
        <div class="game-card" data-game-id="${game.id}">
            ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ""}
            <img src="${imagen}" alt="${game.nombre}" class="game-card-image">
            <div class="game-card-content">
                <div class="game-card-title">${game.nombre}</div>
                <span class="game-card-platform">${game.plataforma}</span>
                <div class="game-card-price">
                    ${discount > 0 ? `<span class="original-price">€${game.precio.toFixed(2)}</span>` : ""}
                    <span class="discount-price">€${(game.precioConDescuento || game.precio).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Muestra el modal con detalles del juego
 */
function showGameModal(game) {
  const modal = document.getElementById("game-modal");
  if (!modal) return;

  // Rellenar datos del modal
  document.getElementById("modal-game-image").src =
    game.imagen || "assets/default.jpg";
  document.getElementById("modal-game-name").textContent = game.nombre;
  document.getElementById("modal-game-description").textContent =
    game.descripcion || "Sin descripción disponible";
  document.getElementById("modal-game-platform").textContent = game.plataforma;
  document.getElementById("modal-game-stock").textContent =
    game.stock > 0 ? "En stock" : "Agotado";

  const discount = game.descuento || 0;
  if (discount > 0) {
    document.getElementById("modal-original-price").textContent =
      `€${game.precio.toFixed(2)}`;
  } else {
    document.getElementById("modal-original-price").textContent = "";
  }
  document.getElementById("modal-discount-price").textContent =
    `€${(game.precioConDescuento || game.precio).toFixed(2)}`;

  // Botón de añadir al carrito
  const addBtn = document.getElementById("add-to-cart-btn");
  if (addBtn) {
    addBtn.onclick = () => {
      if (game.stock > 0) {
        addToCart(game);
        modal.style.display = "none";
      } else {
        showNotification("Producto no disponible", "info");
      }
    };
  }

  // Mostrar modal
  modal.style.display = "flex";

  // Cerrar modal
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  }

  // Cerrar modal si se hace clic fuera
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
}

// ============================================
// ANIMACIONES CSS
// ============================================

const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(300px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
