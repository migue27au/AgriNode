# 🌿 AgriNode

AgriNode es una API REST desarrollada en Node.js para gestionar y monitorizar sistemas de riego inteligente en múltiples invernaderos. Pensado para escalar desde prototipos IoT hasta aplicaciones completas en producción.

---

## 🚀 Tecnologías principales

- Node.js + Express
- PostgreSQL
- Docker + Docker Compose
- NGINX (solo producción)
- API REST modular y escalable

---

## 🧱 Estructura de carpetas

backend/
   ├── controllers/
   ├── services/
   ├── routes/
   ├── models/
   ├── middlewares/
   ├── config/
   ├── index.js
   └── Dockerfile

yaml
Copiar
Editar

---

## 🐳 Cómo iniciar con Docker

1. Clona el repositorio
2. Ejecuta:
   ```bash
   docker-compose up --build
El backend estará disponible en: http://localhost:3000

📦 Endpoints básicos
POST /api/login – Login simulado

GET /api/home – Prueba de disponibilidad (Hello World)

🧪 Inicializar la base de datos
Desde la carpeta raíz:

bash
Copiar
Editar
node db/init_db.js
Esto creará las tablas users y greenhouses si no existen.

📌 TODO (Próximos pasos)
Autenticación JWT

Gestión de sensores y registros de datos

Dashboard web (React)

App móvil (Android)

⚙️ Variables de entorno (.env)
env
Copiar
Editar
DB_HOST=db
DB_USER=user
DB_PASSWORD=password
DB_NAME=irrigation
