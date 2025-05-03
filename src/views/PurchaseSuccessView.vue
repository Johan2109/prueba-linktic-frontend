<template>
  <!-- Contenedor principal centrado y con padding -->
  <div class="max-w-2xl mx-auto text-center p-8">
    <!-- Título de agradecimiento con estilo llamativo -->
    <h2 class="text-3xl font-bold text-green-700 mb-4">
      ¡Gracias por tu compra!
    </h2>

    <!-- Mensaje informativo de confirmación -->
    <p class="text-gray-600">Tu pedido ha sido procesado correctamente.</p>

    <!-- Enlace para volver al catálogo de productos -->
    <router-link to="/" class="mt-6 inline-block text-blue-600 hover:underline">
      Volver a la tienda
    </router-link>
  </div>
</template>

<!-- Script vacío ya que este componente solo es visual -->
<script setup lang="ts"></script>
