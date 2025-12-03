import { getSession } from "../utils/auth";

const API_URL = "http://localhost:8080/api/boletas";

// 1. Crear orden (AHORA ENVIANDO LA DIRECCIÓN)
export async function createOrder(cartItems, direccionTexto) {
  const session = getSession();
  if (!session || !session.token) {
    throw new Error("Debes iniciar sesión para comprar.");
  }

  // Preparamos el paquete para el backend
  const payload = {
    direccionEnvio: direccionTexto,
    items: cartItems.map(p => ({
      codigo: p.codigo,
      cantidad: p.cantidad
    }))
  };

  // Enviamos al Backend
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error al procesar la compra");
  }

  return await response.json();
}

// 2. Obtener historial
export async function getMyOrders() {
  const session = getSession();
  if (!session || !session.token) return [];
  
  const response = await fetch(`${API_URL}/mis-compras`, {
    headers: { "Authorization": `Bearer ${session.token}` }
  });
  
  if (!response.ok) return [];
  return response.json();
}

// 3. Obtener detalle
export async function getOrderById(id) {
  const session = getSession();
  if (!session || !session.token) return null;

  const response = await fetch(`${API_URL}/${id}`, {
    headers: { "Authorization": `Bearer ${session.token}` }
  });
  
  if (!response.ok) return null;
  return response.json();
}