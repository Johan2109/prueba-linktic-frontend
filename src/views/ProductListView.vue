<template>
  <!-- Contenedor principal con fondo gris claro y padding -->
  <div class="min-h-screen bg-gray-50 px-4 sm:px-8 flex flex-col">
    <!-- Área central limitada en ancho y centrada -->
    <div
      class="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-between py-10"
    >
      <!-- ENCABEZADO -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8">
        <!-- Título principal del catálogo -->
        <h2 class="text-2xl font-bold text-blue-900 mb-4 sm:mb-0">
          🛍️ Catálogo de Productos
        </h2>

        <!-- Botón para abrir el modal de creación -->
        <button
          @click="abrirModalCrear"
          class="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-800 transition duration-200"
        >
          <span class="text-lg">＋</span>
          <span>Crear Producto</span>
        </button>
      </div>

      <!-- MENSAJES DE ESTADO -->
      <!-- Mensaje mientras se cargan los productos -->
      <div v-if="loading" class="text-blue-600 text-center text-lg py-10">
        Cargando productos...
      </div>

      <!-- Mensaje en caso de error -->
      <div v-if="error" class="text-red-600 text-center text-lg py-10">
        Error: {{ error }}
      </div>

      <!-- GRID DE PRODUCTOS -->
      <!-- Muestra tarjetas de productos si hay productos disponibles -->
      <div
        v-if="products.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
      >
        <ProductCard
          v-for="item in products"
          :key="item.id"
          :product="item.attributes"
          @agregar-al-carrito="handleAgregarAlCarrito"
        />
      </div>

      <!-- Paginación fija al fondo de la pantalla -->
      <div
        class="mt-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-700 pt-8 border-t border-gray-200"
      >
        <!-- Botón anterior deshabilitado si estamos en la primera página -->
        <button
          :disabled="page === 1"
          @click="page--"
          class="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-full transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>

        <!-- Indicador de página actual -->
        <span class="px-4 text-gray-600 font-medium">
          Página {{ page }} de {{ totalPages }}
        </span>

        <!-- Botón siguiente deshabilitado si ya estamos en la última página -->
        <button
          :disabled="page >= totalPages"
          @click="page++"
          class="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-full transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- MODAL PARA CREAR/EDITAR PRODUCTO -->
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
/* Importación de dependencias y componentes */
import { ref, watchEffect } from "vue";
import ProductCard from "@/components/ProductCard";
import ProductFormModal from "@/components/ProductFormModal.vue";
import { getProducts, createProduct } from "@/services/productService";
import { createInventory } from "@/services/inventoryService";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "vue-toastification";

/* Estado reactivo */
const toast = useToast();
const products = ref<any[]>([]); // Lista de productos
const page = ref(1); // Página actual
const totalPages = ref(1); // Total de páginas
const error = ref(""); // Mensaje de error
const loading = ref(false); // Indicador de carga
const showModal = ref(false); // Visibilidad del modal
const modalMode = ref<"crear" | "editar">("crear"); // Modo del modal
const selectedProduct = ref<any>(null); // Producto seleccionado para edición

const cart = useCartStore(); // Tienda del carrito

// Función para obtener los productos de la API
const fetchProducts = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await getProducts(page.value, 15); // Llamada a la API con paginación
    products.value = res.data;
    totalPages.value = res.meta?.totalPages || 1;
  } catch (err: any) {
    error.value = err.message || "No se pudieron cargar productos";
  } finally {
    loading.value = false;
  }
};

// Se vuelve a llamar a la API cada vez que cambia la página
watchEffect(() => {
  fetchProducts();
});

// Abre el modal en modo creación
const abrirModalCrear = () => {
  modalMode.value = "crear";
  selectedProduct.value = null;
  showModal.value = true;
};

// Guarda un nuevo producto y crea su inventario
const handleGuardar = async (productData: any) => {
  try {
    const res = await createProduct({
      name: productData.name,
      description: productData.description,
      price: productData.price,
    });

    const productId = res.data.data.attributes.id;

    await createInventory({ productId, stock: productData.stock });

    toast.success("Producto creado exitosamente");
    showModal.value = false;
    await fetchProducts(); // Refresca la lista
  } catch (err) {
    console.error("Error al crear producto:", err);
    toast.error("Error al crear el producto");
  }
};

// Cierra el modal si el usuario cancela
const handleCancelar = () => {
  toast.info("Operación cancelada");
  showModal.value = false;
};

// Agrega el producto seleccionado al carrito
const handleAgregarAlCarrito = (producto: any) => {
  cart.addToCart(producto);
};
</script>

<style scoped>
/* Transiciones para fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
