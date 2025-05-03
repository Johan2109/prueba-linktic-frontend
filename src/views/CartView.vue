<template>
  <!-- Contenedor principal centrado y estilizado -->
  <div class="max-w-4xl mx-auto p-6 sm:p-8 bg-white shadow-md rounded-lg">
    <!-- Encabezado con botón para volver y título centrado -->
    <div class="relative mb-8 flex items-center justify-between w-full">
      <!-- Botón para regresar al catálogo -->
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 font-medium px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
      >
        <!-- Icono de flecha -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Volver</span>
      </button>

      <!-- Título centrado mediante posición absoluta -->
      <h2
        class="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-blue-900"
      >
        🛒 Carrito de Compras
      </h2>
    </div>

    <!-- Mensaje si el carrito está vacío -->
    <div v-if="cart.items.length === 0" class="text-gray-600 text-center py-8">
      Tu carrito está vacío.
    </div>

    <!-- Lista de productos del carrito -->
    <div v-else>
      <!-- Iteración por cada producto agregado -->
      <div
        v-for="(item, index) in cart.items"
        :key="item.id"
        class="border-b border-gray-200 py-4 flex justify-between items-center"
      >
        <!-- Información del producto -->
        <div class="text-left">
          <p class="font-medium text-gray-800">
            {{ index + 1 }}. {{ item.name }}
          </p>
          <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
        </div>

        <!-- Precio total y botón para quitar -->
        <div class="text-right">
          <p class="font-semibold text-blue-700">
            ${{ (item.price * item.quantity).toLocaleString() }}
          </p>
          <button
            @click="cart.removeFromCart(item.id)"
            class="text-red-600 text-xs hover:text-red-800 mt-1 underline"
          >
            Quitar
          </button>
        </div>
      </div>

      <!-- Sección final con el total y botón para finalizar -->
      <div class="mt-6 flex flex-col items-end">
        <!-- Total del carrito -->
        <p class="text-lg font-bold text-gray-800">
          Total:
          <span class="text-green-600"
            >${{ cart.totalPrice.toLocaleString() }}</span
          >
        </p>

        <!-- Botón para completar la compra -->
        <button
          @click="finalizarCompra"
          class="mt-4 bg-green-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-green-700 transition shadow"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importa la store del carrito
import { useCartStore } from "@/store/cartStore";

// Vue Router para navegación
import { useRouter } from "vue-router";

// Toast para notificaciones visuales
import { useToast } from "vue-toastification";

// Servicio para actualizar el stock
import { updateStock } from "@/services/inventoryService";

// Inicialización de dependencias
const cart = useCartStore();
const router = useRouter();
const toast = useToast();

// Función para completar la compra
const finalizarCompra = async () => {
  // Si el carrito está vacío, no hace nada
  if (cart.items.length === 0) return;

  try {
    // Itera sobre los productos y actualiza el stock de cada uno
    for (const item of cart.items) {
      const nuevoStock = item.stock - item.quantity;
      await updateStock(item.id, nuevoStock);
    }

    // Limpia el carrito y redirige al inicio
    toast.success("¡Compra finalizada exitosamente!");
    cart.clearCart();
    router.push("/");
  } catch (error) {
    // Muestra mensaje de error si algo falla
    toast.error("Error al actualizar el stock. Inténtalo de nuevo.");
    console.error("Error al finalizar compra:", error);
  }
};
</script>

<style scoped>
/* Estilo aplicado a botones deshabilitados */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
