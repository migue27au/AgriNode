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

---

## 🐳 Cómo iniciar con Docker

1. Clona el repositorio
2. Ejecuta:
   ```bash
   docker-compose up --build
   ```
