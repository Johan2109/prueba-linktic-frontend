<template>
  <!-- Contenedor principal que ocupa toda la altura de la pantalla -->
  <div class="min-h-screen flex flex-col bg-white text-gray-900">
    <!-- Encabezado superior (Header) -->
    <header class="bg-white shadow-sm px-4 py-4 relative">
      <!-- Contenido interno del header con límites y alineaciones -->
      <div class="max-w-7xl mx-auto flex items-center justify-between relative">
        <!-- Logo de la empresa -->
        <div class="flex items-center gap-3 z-10">
          <img
            src="https://linktic.com/media/2024/03/logo-footer.svg"
            alt="Linktic logo"
            class="h-12 sm:h-14 w-auto"
          />
        </div>

        <!-- Enlace al carrito de compras -->
        <router-link
          to="/cart"
          class="relative bg-gray-100 hover:bg-gray-200 transition p-2 rounded-full z-10"
        >
          🛒
          <!-- Badge con el número de productos en el carrito -->
          <span
            v-if="cart.items.length"
            class="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ cart.items.length }}
          </span>
        </router-link>

        <!-- Título centrado visualmente en el header -->
        <h1
          class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl font-bold text-blue-900 text-center whitespace-nowrap"
        >
          Gestión de Productos
        </h1>
      </div>
    </header>

    <!-- Contenido principal que se llenará dinámicamente -->
    <main class="flex-grow p-4 sm:p-6">
      <!-- Renderizado dinámico de rutas -->
      <router-view />
    </main>

    <!-- Pie de página (Footer) -->
    <footer
      class="bg-gray-100 text-gray-600 text-sm text-center py-4 border-t mt-auto"
    >
      <div class="max-w-7xl mx-auto px-4">
        <p>
          &copy; {{ new Date().getFullYear() }} Linktic. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Importa y usa el store del carrito desde Pinia
import { useCartStore } from "@/store/cartStore";
const cart = useCartStore();
</script>
