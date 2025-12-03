import { getSession } from "../utils/auth";

const API_URL = "http://localhost:8080/api";

const authHeader = () => {
  const session = getSession();
  return session && session.token ? { "Authorization": `Bearer ${session.token}` } : {};
};

// --- PRODUCTOS ---
export const adminGetProducts = async () => {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(product)
  });
  return res.json();
};

export const updateProduct = async (product) => {
  const res = await fetch(`${API_URL}/productos/${product.codigo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(product)
  });
  return res.json();
};

export const deleteProduct = async (codigo) => {
  await fetch(`${API_URL}/productos/${codigo}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  });
};

// --- USUARIOS ---
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/usuarios`, { headers: authHeader() });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: authHeader()
  });
  if (!res.ok) throw new Error("No se puede eliminar (posiblemente tenga compras).");
};

// ESTA ES LA FUNCIÓN CORRECTA AHORA (reemplaza a updateUserRole)
export const updateUser = async (id, userData) => {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(userData)
  });
  
  if (!res.ok) throw new Error("Error al actualizar el usuario.");
  return res.json();
};

// --- VENTAS ---
export const getAllOrders = async () => {
    try {
        const res = await fetch(`${API_URL}/boletas`, { headers: authHeader() });
        return res.json();
    } catch(e) { return []; }
};

export const createUser = async (user) => {
  const res = await fetch(`${API_URL}/usuarios`, { // Usamos el endpoint POST del UsuarioController
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error("Error al crear usuario (quizás el correo ya existe).");
  return res.json();
};