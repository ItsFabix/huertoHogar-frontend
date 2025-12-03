// src/services/productService.js
const API_URL = "http://localhost:8080/api/productos";

export async function getAllProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}