<template>
  <!-- Contenedor principal centrado -->
  <div class="max-w-4xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-xl">
    <!-- Encabezado con botón de volver y título centrado -->
    <div class="relative mb-8 flex items-center justify-between w-full">
      <!-- Botón para volver al catálogo -->
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 font-medium px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
      >
        <!-- Icono de flecha -->
        <svg
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

      <!-- Título centrado (posición absoluta para mantenerlo alineado aún con botón presente) -->
      <h2
        class="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-blue-900"
      >
        📅 Detalle del Producto
      </h2>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-blue-600 text-center text-lg py-10">
      Cargando...
    </div>

    <!-- Estado de error -->
    <div v-if="error" class="text-red-600 text-center text-lg py-10">
      Error: {{ error }}
    </div>

    <!-- Vista principal del producto (solo si ya está cargado) -->
    <div
      v-if="product"
      class="flex flex-col sm:flex-row justify-between items-start gap-8"
    >
      <!-- Información detallada del producto -->
      <div class="flex-1 space-y-3">
        <h3 class="text-xl font-semibold text-gray-800">{{ product.name }}</h3>
        <p class="text-gray-600">{{ product.description }}</p>
        <p class="text-2xl text-blue-700 font-bold">
          ${{ product.price.toLocaleString() }}
        </p>
        <p class="text-sm text-green-700">
          Stock disponible:
          <span class="font-semibold">{{
            inventoryStock !== null ? inventoryStock : "No disponible"
          }}</span>
        </p>
      </div>

      <!-- Botones de acción: Editar y Eliminar -->
      <div class="flex flex-col gap-4 w-full sm:w-auto">
        <button
          @click="editarProducto"
          class="w-full px-5 py-2.5 bg-yellow-500 text-white rounded-md text-sm font-semibold hover:bg-yellow-600 transition shadow"
        >
          ✏️ Editar
        </button>
        <button
          @click="showConfirm = true"
          class="w-full px-5 py-2.5 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition shadow"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold text-red-700 mb-4 text-center">
          ⚠️ Confirmar eliminación
        </h2>
        <p class="text-gray-700 text-center mb-6">
          Esta acción eliminará el producto y su inventario. ¿Deseas continuar?
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="cancelarEliminacion"
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmarEliminacion"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para editar el producto -->
    <ProductFormModal
      :visible="showModal"
      :mode="modalMode"
      :producto="selectedProduct"
      @guardar="handleGuardar"
      @cancelar="handleCancelar"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Servicios para productos e inventario
import {
  getInventoryByProductId,
  updateStock,
  deleteInventoryByProductId,
} from "@/services/inventoryService";

import {
  getProductById,
  deleteProduct,
  updateProduct,
} from "@/services/productService";

import ProductFormModal from "@/components/ProductFormModal.vue";
import { useToast } from "vue-toastification";
import { useCartStore } from "@/store/cartStore";

// Tienda del carrito
const cart = useCartStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

// Estados reactivos
const modalMode = ref<"crear" | "editar">("crear");
const showModal = ref(false);
const showConfirm = ref(false);

const product = ref<{
  name: string;
  description: string;
  price: number;
} | null>(null);
const inventoryStock = ref<number | null>(null);
const selectedProduct = ref<any>(null);
const loading = ref(true);
const error = ref("");

// Obtener información de producto e inventario
const fetchInventory = async () => {
  try {
    loading.value = true;
    const [productRes, inventoryRes] = await Promise.all([
      getProductById(id),
      getInventoryByProductId(id),
    ]);

    const productAttributes = productRes.data?.data?.attributes;
    const inventoryAttributes = inventoryRes.data?.attributes;

    product.value = {
      name: productAttributes?.name,
      description: productAttributes?.description,
      price: productAttributes?.price,
    };

    inventoryStock.value = inventoryAttributes?.stock ?? null;
  } catch (err: any) {
    error.value = err.message || "Error al cargar los datos del producto.";
  } finally {
    loading.value = false;
  }
};

// Abrir modal con los datos del producto cargado para editar
const editarProducto = () => {
  modalMode.value = "editar";
  selectedProduct.value = {
    id,
    name: product.value?.name,
    description: product.value?.description,
    price: product.value?.price,
    stock: inventoryStock.value,
  };
  showModal.value = true;
};

// Confirmar eliminación de producto
const confirmarEliminacion = async () => {
  showConfirm.value = false;
  await eliminarProducto();
};

// Cancelar eliminación (cerrar modal y mostrar mensaje)
const cancelarEliminacion = () => {
  showConfirm.value = false;
  toast.info("Eliminación cancelada");
};

// Eliminar producto e inventario y redirigir
const eliminarProducto = async () => {
  try {
    cart.removeFromCart(id); // También quitar del carrito si está ahí
    await deleteInventoryByProductId(id);
    await deleteProduct(id);
    toast.success("Producto eliminado exitosamente");
    router.push("/");
  } catch (err) {
    toast.error("Producto no eliminado exitosamente");
    console.error("Error al eliminar producto o inventario:", err);
  }
};

// Guardar los cambios del producto
const handleGuardar = async (updatedData: any) => {
  try {
    await updateProduct(updatedData.id, {
      name: updatedData.name,
      description: updatedData.description,
      price: updatedData.price,
    });

    // Si el stock ha cambiado, actualizar también
    if (
      inventoryStock.value !== null &&
      updatedData.stock !== inventoryStock.value
    ) {
      await updateStock(updatedData.id, updatedData.stock);
    }

    toast.success("Producto actualizado exitosamente");
    showModal.value = false;
    await fetchInventory(); // Recargar información actualizada
  } catch (err) {
    toast.error("Error al actualizar producto");
  }
};

// Cancelar la edición (cierra modal y da feedback)
const handleCancelar = () => {
  showModal.value = false;
  toast.info("Edición cancelada");
};

// Al montar el componente, cargar los datos del producto
onMounted(fetchInventory);
</script>

<style scoped>
/* Estilo deshabilitado para botones */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
