# 🛒 Gestión de Productos - Frontend

Este proyecto es una interfaz de usuario construida con **Vue 3**, **TypeScript** y **Tailwind CSS** para gestionar productos e inventario. Permite listar, crear, editar, eliminar productos y manejar un carrito de compras conectado a microservicios backend.

## 📦 Características

- Listado de productos con paginación.
- Detalle de producto.
- CRUD de productos (crear, editar, eliminar).
- Gestión de stock conectada al microservicio de inventario.
- Carrito de compras con persistencia temporal.
- Mensajes de notificación visuales con `vue-toastification`.
- UI adaptable a dispositivos móviles y escritorio.

## 🧰 Tecnologías

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) para gestión de estado
- [Axios](https://axios-http.com/) para llamadas a APIs
- [Vue Toastification](https://github.com/Maronato/vue-toastification) para alertas

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Johan2109/prueba-linktic-frontend
cd prueba-linktic-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configuración del entorno

Crea un archivo `.env` en la raíz con la siguiente configuración:

```env
VITE_API_URL=http://localhost:5154/api
VITE_API_KEY=mi-api-key-supersecreta
```

Asegúrate de que esta información coincida con la configuración de tus microservicios backend.

### 4. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto se iniciará normalmente en `http://localhost:5173`.

---

## 🛠️ Endpoints esperados

Asegúrate de tener en funcionamiento los siguientes microservicios:

### Productos (`:5154`)

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Inventario (`:5160`)

- `GET /api/inventory/:productId`
- `POST /api/inventory`
- `PUT /api/inventory/:productId`
- `DELETE /api/inventory/:productId`

> Todos protegidos por el header `X-API-KEY`.

---

## 🧪 Pruebas

Para ejecutar pruebas unitarias:

```bash
npm run test
```
