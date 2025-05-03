// Importa la función principal para crear una aplicación Vue
import { createApp } from "vue";

// Importa el componente raíz de la aplicación
import App from "./App.vue";

// Importa Pinia para el manejo del estado global
import { createPinia } from "pinia";

// Importa el router para el manejo de rutas de la SPA
import router from "./router";

// Importa Toastification y su configuración para notificaciones
import Toast, { PluginOptions, POSITION } from "vue-toastification";

// Importa los estilos CSS necesarios para que Toastification funcione correctamente
import "vue-toastification/dist/index.css";

// Importa los estilos globales definidos por el desarrollador
import "@/assets/main.css";

// Crea la instancia de la aplicación Vue
const app = createApp(App);

// Agrega el store Pinia a la instancia de la app
app.use(createPinia());

// Define las opciones de configuración para Toastification
const options: PluginOptions = {
  position: POSITION.TOP_CENTER, // Posición de las notificaciones (arriba al centro)
  timeout: 3000, // Duración en milisegundos que se muestra la notificación
  closeOnClick: true, // Permite cerrar al hacer clic
  pauseOnHover: true, // Pausa el temporizador cuando el cursor está encima
};

// Registra el router en la aplicación
app.use(router);

// Registra el plugin de Toastification con las opciones definidas
app.use(Toast, options);

// Monta la app en el div con id="app" en el archivo HTML
app.mount("#app");
