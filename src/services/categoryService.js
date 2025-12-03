import { getSession } from "../utils/auth"; // Necesitamos token para editar

const API_URL = "http://localhost:8080/api/categorias";

const authHeader = () => {
  const session = getSession();
  return session && session.token ? { "Authorization": `Bearer ${session.token}` } : {};
};

export async function getCategories() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function createCategory(cat) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(cat)
  });
  return res.json();
}

export async function updateCategory(cat) {
  const res = await fetch(`${API_URL}/${cat.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(cat)
  });
  return res.json();
}

export async function deleteCategory(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeader()
  });
}