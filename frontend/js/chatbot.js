/**
 * chatbot.js - Lógica del chatbot de soporte
 *
 * El chatbot puede funcionar de dos formas:
 * 1. Con respuestas automáticas predefinidas (sin API)
 * 2. Integrado con OpenAI/Hugging Face (con API)
 */

let chatbotOpen = false;

document.addEventListener("DOMContentLoaded", () => {
  setupChatbot();
});

/**
 * Configura los event listeners del chatbot
 */
function setupChatbot() {
  const toggle = document.getElementById("chatbot-toggle");
  const close = document.getElementById("chatbot-close");
  const send = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");

  if (toggle) {
    toggle.addEventListener("click", toggleChatbot);
  }

  if (close) {
    close.addEventListener("click", closeChatbot);
  }

  if (send) {
    send.addEventListener("click", sendMessage);
  }

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
}

/**
 * Abre/cierra el chatbot
 */
function toggleChatbot() {
  const window_element = document.getElementById("chatbot-window");
  if (window_element) {
    window_element.style.display =
      window_element.style.display === "none" ? "flex" : "none";
    chatbotOpen = window_element.style.display === "flex";

    if (chatbotOpen) {
      // Mensaje de bienvenida
      const messages = document.getElementById("chatbot-messages");
      if (messages && messages.children.length === 0) {
        addChatbotMessage(
          "¡Hola! Soy tu asistente de soporte. ¿En qué puedo ayudarte?",
          "bot",
        );
      }
    }
  }
}

/**
 * Cierra el chatbot
 */
function closeChatbot() {
  const window_element = document.getElementById("chatbot-window");
  if (window_element) {
    window_element.style.display = "none";
    chatbotOpen = false;
  }
}

/**
 * Envía un mensaje al chatbot
 */
async function sendMessage() {
  const input = document.getElementById("chatbot-input");
  const message = input?.value.trim();

  if (!message) return;

  // Mostrar mensaje del usuario
  addChatbotMessage(message, "user");
  input.value = "";

  try {
    // Intentar obtener respuesta de la API
    const response = await chatbotMessage(message);

    if (response && response.respuesta) {
      addChatbotMessage(response.respuesta, "bot");
    } else {
      // Si falla, usar respuestas predefinidas
      const reply = getDefaultChatbotReply(message);
      addChatbotMessage(reply, "bot");
    }
  } catch (error) {
    console.error("Error en chatbot:", error);
    const reply = getDefaultChatbotReply(message);
    addChatbotMessage(reply, "bot");
  }
}

/**
 * Añade un mensaje al historial del chatbot
 */
function addChatbotMessage(message, sender) {
  const messagesContainer = document.getElementById("chatbot-messages");
  if (!messagesContainer) return;

  const messageElement = document.createElement("div");
  messageElement.className = `chatbot-message ${sender}`;
  messageElement.textContent = message;

  messagesContainer.appendChild(messageElement);

  // Scroll hacia el último mensaje
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Respuestas automáticas predefinidas (fallback)
 * Esto se ejecuta si la API no está disponible
 */
function getDefaultChatbotReply(userMessage) {
  const msg = userMessage.toLowerCase();

  // Palabras clave y respuestas
  const responses = {
    // Saludos
    hola: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    hi: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    buenos:
      "¡Hola! Bienvenido a nuestra tienda. ¿Hay algo en lo que pueda ayudarte?",

    // Preguntas sobre productos
    juegos:
      "Tenemos una gran selección de juegos para PC, PlayStation, Xbox y Nintendo. ¿Busca un juego en particular?",
    juego:
      "Tenemos una gran selección de juegos. ¿Busca uno en particular o quiere ver nuestras ofertas?",
    precio:
      "Los precios varían según el juego. Puedes ver el catálogo completo en nuestra tienda con todos los precios actualizados.",
    descuento:
      'Tenemos descuentos especiales en muchos juegos. ¡Mira nuestra sección de "Ofertas Destacadas"!',
    oferta:
      'Tenemos descuentos especiales en muchos juegos. ¡Visita la sección de "Ofertas Destacadas"!',

    // Preguntas sobre compras
    carrito:
      "Puedes añadir juegos a tu carrito desde la página de tienda. Luego ve a tu carrito para revisar y proceder al pago.",
    compra:
      "Para comprar, selecciona los juegos que desees, añádelos al carrito y procede al checkout.",
    pago: "El proceso de pago es seguro y rápido. Completarás tu compra en pocos pasos.",
    envío:
      "Como vendemos productos digitales, no hay envío. Recibirás acceso inmediatamente después de la compra.",
    digital:
      "Sí, todos nuestros productos son digitales. Los recibirás al instante.",

    // Preguntas sobre plataformas
    pc: "Tenemos muchos juegos disponibles para PC. ¡Diríjete a nuestra tienda y filtra por plataforma PC!",
    playstation:
      "Tenemos juegos para PlayStation. Filtra por esa plataforma en nuestra tienda.",
    xbox: "Tenemos juegos para Xbox. Filtra por esa plataforma en nuestra tienda.",
    nintendo:
      "Tenemos juegos para Nintendo. Filtra por esa plataforma en nuestra tienda.",

    // Soporte general
    ayuda:
      "¿Hay algo específico en lo que pueda ayudarte? Pregunta sobre productos, compras, envíos, etc.",
    soporte:
      "¿En qué puedo ayudarte? Estoy aquí para responder preguntas sobre nuestros servicios.",
    contacto:
      "Estoy aquí para ayudarte. También puedes contactar a nuestro equipo a través del email de soporte.",
    problema: "¿Cuál es el problema? Haré todo lo posible para ayudarte.",

    // Información general
    quién:
      "Soy un asistente de soporte de ENEBA Clone, tu tienda online de videojuegos.",
    qué: "¿Qué necesitas saber? Puedo ayudarte con información sobre productos, compras, y mucho más.",
    cómo: "¿Cómo puedo ayudarte específicamente?",
  };

  // Buscar palabras clave en el mensaje
  for (const [keyword, reply] of Object.entries(responses)) {
    if (msg.includes(keyword)) {
      return reply;
    }
  }

  // Respuesta por defecto
  return "Entiendo tu pregunta. ¿Puedes ser más específico? Puedo ayudarte con información sobre productos, compras, envíos y más.";
}

// ============================================
// ANIMACIÓN CSS PARA CHATBOT
// ============================================

const chatbotStyle = document.createElement("style");
chatbotStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .chatbot-message {
        animation: slideUp 0.3s ease;
    }
`;
document.head.appendChild(chatbotStyle);
