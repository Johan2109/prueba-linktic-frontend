// Importa la función defineStore desde Pinia para crear una tienda
import { defineStore } from "pinia";

// Define y exporta una nueva store llamada "cart"
export const useCartStore = defineStore("cart", {
  // Estado reactivo que mantiene los ítems del carrito
  state: () => ({
    items: [] as {
      id: string; // ID del producto
      name: string; // Nombre del producto
      price: number; // Precio unitario
      quantity: number; // Cantidad agregada al carrito
      stock: number; // Stock disponible en inventario
    }[],
  }),

  // Getter que calcula el precio total del carrito
  getters: {
    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, // Suma acumulada del total
        0
      ),
  },

  // Acciones que modifican el estado del carrito
  actions: {
    /**
     * Agrega un producto al carrito.
     * Si el producto ya está en el carrito, incrementa la cantidad si hay stock disponible.
     * Si no está, lo agrega con cantidad inicial de 1.
     */
    addToCart(product: {
      id: string;
      name: string;
      price: number;
      stock: number;
    }) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Verifica que no se exceda el stock
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++;
        } else {
          throw new Error("No hay suficiente stock disponible.");
        }
      } else {
        // Agrega nuevo producto al carrito con cantidad inicial 1
        this.items.push({ ...product, quantity: 1 });
      }
    },

    /**
     * Elimina un producto del carrito según su ID.
     */
    removeFromCart(productId: string) {
      this.items = this.items.filter((item) => item.id !== productId);
    },

    /**
     * Vacía completamente el carrito.
     */
    clearCart() {
      this.items = [];
    },
  },
});
