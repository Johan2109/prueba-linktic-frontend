<template>
  <!-- Contenedor del modal (sólo visible si `visible` es true) -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <!-- Caja blanca del modal centrado -->
    <div
      class="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 sm:p-8 relative"
    >
      <!-- Título del modal (varía según el modo) -->
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
        {{ mode === "editar" ? "✏️ Editar Producto" : "🆕 Crear Producto" }}
      </h2>

      <!-- Campos del formulario generados dinámicamente desde `fields` -->
      <div class="space-y-5">
        <div v-for="field in fields" :key="field.model">
          <!-- Etiqueta del input -->
          <label
            :for="field.model"
            class="block mb-1 font-medium text-gray-700"
          >
            {{ field.label }}
          </label>

          <!-- Campo input con enlace bidireccional a `localProduct` -->
          <input
            :id="field.model"
            v-model="localProduct[field.model]"
            :type="field.type"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            :placeholder="field.placeholder"
            :step="field.type === 'number' ? '0.01' : undefined"
          />
        </div>
      </div>

      <!-- Botones de acción: Cancelar y Guardar -->
      <div class="mt-8 flex flex-col sm:flex-row justify-end gap-4">
        <button
          @click="$emit('cancelar')"
          class="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          @click="guardar"
          class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Importaciones de Vue necesarias
import { ref, watch, defineProps, defineEmits } from "vue";

// Definición de propiedades que recibe el componente
const props = defineProps({
  visible: Boolean, // Controla visibilidad del modal
  mode: { type: String, default: "crear" }, // Modo de operación: "crear" o "editar"
  producto: {
    type: Object as () => {
      name: string;
      description: string;
      price: number;
      stock?: number;
    } | null,
    default: null,
  },
});

// Definición de eventos emitidos hacia el componente padre
const emit = defineEmits(["guardar", "cancelar"]);

// Estado local del producto que se está editando o creando
const localProduct = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
});

// Configuración de los campos del formulario
const fields = [
  {
    label: "Nombre",
    model: "name",
    type: "text",
  },
  {
    label: "Descripción",
    model: "description",
    type: "text",
  },
  {
    label: "Precio",
    model: "price",
    type: "number",
    placeholder: "Ej. 2500",
  },
  {
    label: "Stock",
    model: "stock",
    type: "number",
    placeholder: "Ej. 15",
  },
];

// Observa cambios en visibilidad y modo para inicializar el formulario
watch(
  () => [props.visible, props.mode],
  ([visible, mode]) => {
    if (visible && mode === "crear") {
      // Reinicia el formulario si se va a crear un producto nuevo
      localProduct.value = {
        name: "",
        description: "",
        price: 0,
        stock: 0,
      };
    } else if (visible && props.producto) {
      // Si se está editando, carga los datos del producto recibido
      localProduct.value = { ...props.producto };
    }
  },
  { immediate: true } // Ejecuta la lógica también al montar
);

// Emitir el evento de guardar con los datos actuales del formulario
const guardar = () => {
  emit("guardar", { ...localProduct.value });
};
</script>

<style scoped>
/* Mejora del enfoque visual para los inputs */
input:focus {
  outline: none;
}
</style>
