// Importaciones necesarias desde vue-router
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalizedLoaded,
} from "vue-router";

// Importación de las vistas que se usarán directamente
import ProductListView from "@/views/ProductListView.vue";
import CartView from "@/views/CartView.vue";
import PurchaseSuccessView from "@/views/PurchaseSuccessView.vue";

// Definición de las rutas disponibles en la aplicación
const routes = [
  {
    path: "/", // Ruta raíz
    name: "ProductList", // Nombre de la ruta
    component: ProductListView, // Componente asociado
  },
  {
    path: "/products/:id", // Ruta dinámica para detalle de producto
    name: "ProductDetail",
    // Carga perezosa (lazy loading) del componente para mejorar el rendimiento
    component: () => import("@/views/ProductDetailView.vue"),
    // Props que se pasan al componente desde la URL
    props: (route: RouteLocationNormalizedLoaded) => ({
      id: route.params.id, // id del producto desde el path
      name: route.query.name, // nombre desde query string
      description: route.query.description, // descripción desde query
      price: route.query.price, // precio desde query
    }),
  },
  {
    path: "/cart", // Ruta para el carrito
    name: "Cart",
    component: CartView,
  },
  {
    path: "/success", // Ruta de confirmación de compra
    name: "PurchaseSuccess",
    component: PurchaseSuccessView,
  },
];

// Creación del enrutador con historial HTML5 y las rutas definidas
const router = createRouter({
  history: createWebHistory(), // Utiliza el modo de historial para URLs limpias
  routes, // Conjunto de rutas previamente definidas
});

// Exporta el enrutador para usarlo en la instancia de Vue
export default router;
