// src/services/authService.js
const API_URL = "http://localhost:8080/api/auth";

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales inválidas");
    }

    const data = await response.json();
    // CAMBIO IMPORTANTE: Devolvemos TODO el objeto (token, nombre, email, rol)
    // Antes solo devolvíamos data.token
    return data; 
  } catch (error) {
    throw error;
  }
}

export async function register(usuario) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) {
     const err = await response.text();
     throw new Error(err || "Error al registrar");
  }
  return await response.json();
}