# ProyectoLM-2026: Tienda Digital ENEBA Clone

Proyecto final del módulo **Lenguaje de Marcas** - Desarrollo full-stack de una plataforma de compraventa de videojuegos similar a ENEBA.

## 📋 Descripción

Aplicación web completa que permite:
- ✅ Navegar catálogo de videojuegos
- ✅ Carrito de compras funcional
- ✅ Inventario en base de datos
- ✅ Sistema de autenticación (login/registro)
- ✅ Chatbot de soporte con IA
- ✅ Panel de administración básico

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5 / CSS3 / JavaScript vanilla**
- Servidor: GitHub Pages (estático)

### Backend
- **Java 21 LTS**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Maven** (gestor de dependencias)

### Base de Datos
- **MySQL 8.x**

### APIs Externas
- OpenAI o Hugging Face (chatbot)

---

## 📁 Estructura del Proyecto

```
ProyectoLM-2026/
├── frontend/                  # HTML/CSS/JS vanilla
│   ├── index.html            # Página principal
│   ├── shop.html             # Catálogo
│   ├── carrito.html          # Carrito de compras
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js           # Lógica principal
│   │   ├── api.js            # Funciones para consumir API
│   │   └── chatbot.js        # Chatbot
│   └── assets/               # Imágenes
│
├── backend/                   # API REST (Java + Spring Boot)
│   ├── src/
│   │   ├── main/java/com/eneba/
│   │   │   ├── EnebaApplication.java
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── config/
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
└── README.md
```

---

## 🚀 Instalación y Setup

### Requisitos
- Java 21 LTS
- MySQL 8.x
- Git 2.x
- Maven 3.6+

### 1. Clonar el repositorio
```bash
git clone https://github.com/paconino1/ProyectoLM_2026.git
cd ProyectoLM-2026
```

### 2. Setup del Backend (Spring Boot)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
La API estará disponible en: `http://localhost:8080`

### 3. Setup del Frontend
Abre `frontend/index.html` en tu navegador o usa un servidor local:
```bash
cd frontend
python -m http.server 3000
```
O desde el terminal de VS Code: Live Server

---

## 📚 Fases del Proyecto

### Fase 1: Setup Inicial ✅
- [x] Estructura de carpetas
- [x] Configuración de Git/GitHub
- [ ] Proyecto Maven base
- [ ] Conexión MySQL

### Fase 2: API REST Backend
- [ ] Entidades: Juego, Usuario, Compra
- [ ] CRUD endpoints
- [ ] Autenticación
- [ ] Validaciones

### Fase 3: Frontend Funcional
- [ ] Home
- [ ] Catálogo
- [ ] Detalles de producto
- [ ] Carrito

### Fase 4: Funcionalidades Avanzadas
- [ ] Chatbot de soporte
- [ ] Panel de admin
- [ ] Filtros y búsqueda

### Fase 5: Deploy
- [ ] GitHub Pages (frontend)
- [ ] Railway/Render (backend)

---

## 🔗 Links Útiles

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📝 Licencia

Proyecto educativo - Módulo Lenguaje de Marcas 2026

---

**Autor**: paconino1  
**Actualizado**: Marzo 2026
