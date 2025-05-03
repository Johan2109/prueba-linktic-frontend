<template>
  <!-- Contenedor de la tarjeta del producto -->
  <div
    class="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center text-center"
  >
    <!-- Nombre del producto -->
    <h3 class="text-base font-semibold text-gray-800 mb-1">
      {{ product.name }}
    </h3>

    <!-- Descripción del producto -->
    <p class="text-sm text-gray-500 mb-1">
      {{ product.description }}
    </p>

    <!-- Precio formateado del producto -->
    <p class="text-blue-700 font-bold text-lg mb-4">
      ${{ product.price.toLocaleString() }}
    </p>

    <!-- Botones: Ver detalle y Agregar -->
    <div class="flex gap-3 justify-center w-full">
      <!-- Botón para navegar a la vista de detalle del producto -->
      <router-link
        :to="{ name: 'ProductDetail', params: { id: product.id } }"
        class="flex-1 text-sm font-medium text-center text-white bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-700 shadow"
      >
        Ver detalle
      </router-link>

      <!-- Botón para agregar al carrito (se oculta si no hay stock disponible) -->
      <button
        v-if="!isAgregarDisabled"
        @click="handleAgregarAlCarrito"
        class="flex-1 text-sm font-medium px-3 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow transition"
      >
        Agregar
      </button>
    </div>

    <!-- Mensaje de stock agotado -->
    <p v-if="isAgregarDisabled" class="text-xs text-red-600 mt-3">
      Stock agotado
    </p>
  </div>
</template>

<script lang="ts" setup>
// Importaciones necesarias
import { getInventoryByProductId } from "@/services/inventoryService";
import { useToast } from "vue-toastification";
import { useCartStore } from "@/store/cartStore";
import { ref, onMounted, computed } from "vue";

// Acceso al store del carrito y sistema de notificaciones
const cart = useCartStore();
const toast = useToast();

// Props que recibe el componente: los datos del producto
const props = defineProps<{
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
}>();

// Estado reactivo para el stock disponible
const stockDisponible = ref<number>(0);

// Al montar el componente, se consulta el stock del producto
onMounted(async () => {
  try {
    const res = await getInventoryByProductId(props.product.id);
    stockDisponible.value = res.data?.attributes?.stock ?? 0;
  } catch (err) {
    stockDisponible.value = 0;
  }
});

// Función para agregar el producto al carrito
const handleAgregarAlCarrito = async () => {
  try {
    // Verifica si el producto ya está en el carrito
    const itemInCart = cart.items.find((item) => item.id === props.product.id);
    const cantidadEnCarrito = itemInCart ? itemInCart.quantity : 0;

    // No permite agregar más de lo disponible
    if (cantidadEnCarrito >= stockDisponible.value) {
      toast.warning("Ya has agregado la cantidad máxima disponible");
      return;
    }

    // Agrega el producto al carrito
    cart.addToCart({
      id: props.product.id,
      name: props.product.name,
      price: props.product.price,
      stock: stockDisponible.value,
    });

    toast.success("Producto agregado al carrito");
  } catch (err) {
    toast.error("No se pudo agregar el producto");
    console.error(err);
  }
};

// Computed que deshabilita el botón si no hay stock
const isAgregarDisabled = computed(() => {
  const item = cart.items.find((i) => i.id === props.product.id);
  return (
    stockDisponible.value === 0 ||
    (item && item.quantity >= stockDisponible.value)
  );
});
</script>

<style scoped>
/* Asegura que las imágenes (si se agregan) tengan bordes redondeados */
img {
  border-radius: 0.5rem;
}
</style>
