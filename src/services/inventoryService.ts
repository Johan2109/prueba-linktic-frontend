// Importa Axios para realizar solicitudes HTTP
import axios from "axios";

// Crea una instancia de Axios para el microservicio de inventario
const inventoryApi = axios.create({
  baseURL: "http://localhost:5208/api", // URL base del microservicio de inventario (ajústalo si usas otro puerto)
  headers: {
    "Content-Type": "application/json", // Especifica que se enviará/recibirá JSON
    "X-API-KEY": "mi-api-key-supersecreta", // Autenticación por API Key
  },
});

/**
 * Obtiene el inventario asociado a un producto por su ID.
 * @param productId ID del producto
 * @returns Inventario del producto
 */
export const getInventoryByProductId = async (productId: string) => {
  const response = await inventoryApi.get(`/inventory/${productId}`);
  console.log("Response from inventory API:", response); // Log opcional para depuración
  return response.data;
};

/**
 * Actualiza el stock de un producto específico.
 * @param productId ID del producto
 * @param newStock Nuevo valor de stock
 */
export const updateStock = async (productId: string, newStock: number) => {
  return await inventoryApi.put(`/inventory/${productId}`, newStock);
};

/**
 * Crea un nuevo registro de inventario para un producto.
 * @param inventory Objeto con el ID del producto y su stock inicial
 */
export const createInventory = async (inventory: {
  productId: string;
  stock: number;
}) => {
  return await inventoryApi.post("/inventory", inventory);
};

/**
 * Elimina el inventario asociado a un producto por su ID.
 * @param productId ID del producto
 */
export const deleteInventoryByProductId = async (productId: string) => {
  return await inventoryApi.delete(`/inventory/${productId}`);
};
