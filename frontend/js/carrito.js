/**
 * carrito.js - Lógica específica de la página del carrito
 */

document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  setupCheckout();
});

/**
 * Muestra los items del carrito
 */
function displayCart() {
  const cart = getCarrito();
  const cartList = document.getElementById("cart-items-list");
  const subtotal = document.getElementById("subtotal");
  const discounts = document.getElementById("discounts");
  const total = document.getElementById("total");

  if (cart.length === 0) {
    cartList.innerHTML =
      '<p class="empty-cart">Tu carrito está vacío. <a href="shop.html">Continúa comprando</a></p>';
    subtotal.textContent = "€0.00";
    discounts.textContent = "-€0.00";
    total.textContent = "€0.00";
    return;
  }

  // Calcular totales
  const subtotalValue = cart.reduce(
    (sum, item) => sum + item.precio * (item.quantity || 1),
    0,
  );
  const discountValue = 0; // Placeholder para futuras promociones
  const totalValue = subtotalValue - discountValue;

  // Mostrar items
  cartList.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.nombre}</div>
                <div class="cart-item-platform">${item.plataforma}</div>
                <div style="color: #999; font-size: 0.9rem;">Cantidad: ${item.quantity || 1}</div>
            </div>
            <div class="cart-item-price">€${(item.precio * (item.quantity || 1)).toFixed(2)}</div>
            <button class="remove-item" onclick="removeAndRefresh(${item.id})">Eliminar</button>
        </div>
    `,
    )
    .join("");

  // Actualizar resumen
  subtotal.textContent = `€${subtotalValue.toFixed(2)}`;
  discounts.textContent = `-€${discountValue.toFixed(2)}`;
  total.textContent = `€${totalValue.toFixed(2)}`;
}

/**
 * Elimina un item y actualiza la vista
 */
function removeAndRefresh(gameId) {
  removeFromCart(gameId);
  displayCart();
}

/**
 * Configura el botón de checkout
 */
function setupCheckout() {
  const checkoutBtn = document.getElementById("checkout-btn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cart = getCarrito();

      if (cart.length === 0) {
        showNotification("El carrito está vacío", "info");
        return;
      }

      // Crear objeto de compra
      const compra = {
        items: cart,
        total: getCartTotal(),
        fecha: new Date().toISOString(),
      };

      try {
        // Intentar crear la compra en el backend
        const result = await createCompra(compra);

        if (result) {
          showNotification("Compra realizada con éxito", "success");
          clearCart();
          displayCart();

          // Redirigir después de 2 segundos
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          showNotification("Error al procesar la compra", "info");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("Error en el servidor", "info");
      }
    });
  }
}
