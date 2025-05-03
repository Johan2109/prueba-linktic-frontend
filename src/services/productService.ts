// Importa la librería Axios para realizar peticiones HTTP
import axios from "axios";

// Crea una instancia de Axios con configuración base
const apiClient = axios.create({
  baseURL: "http://localhost:5154/api", // URL base del microservicio de productos (ajústala según sea necesario)
  headers: {
    "Content-Type": "application/json", // Tipo de contenido para las peticiones
    "X-API-KEY": "mi-api-key-supersecreta", // Encabezado de autenticación por API Key
  },
});

/**
 * Obtiene una lista paginada de productos.
 * @param page Número de página a solicitar (por defecto 1)
 * @param pageSize Cantidad de productos por página (por defecto 6)
 */
export const getProducts = async (page = 1, pageSize = 6) => {
  const response = await apiClient.get("/products", {
    params: { page, pageSize },
  });
  return response.data; // Retorna los datos de la respuesta
};

/**
 * Obtiene un producto por su ID.
 * @param productId ID del producto
 */
export const getProductById = async (productId: string) => {
  return await apiClient.get(`/products/${productId}`);
};

/**
 * Crea un nuevo producto.
 * @param product Objeto con nombre, descripción y precio del producto
 */
export const createProduct = async (product: {
  name: string;
  description: string;
  price: number;
}) => {
  return await apiClient.post("/products", product);
};

/**
 * Actualiza un producto existente.
 * @param productId ID del producto a actualizar
 * @param product Objeto con los nuevos datos del producto
 */
export const updateProduct = async (
  productId: string,
  product: {
    name: string;
    description: string;
    price: number;
  }
) => {
  return await apiClient.put(`/products/${productId}`, product);
};

/**
 * Elimina un producto por su ID.
 * @param productId ID del producto a eliminar
 */
export const deleteProduct = async (productId: string) => {
  return await apiClient.delete(`/products/${productId}`);
};
