// Utilidades simples para manejar sesión en LocalStorage

const SESSION_KEY = "currentUser";

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getSession();
}

export function setSession(userObj) {
  // Por si más adelante quieres setear sesión desde otro lado
  localStorage.setItem(SESSION_KEY, JSON.stringify(userObj || null));
  window.dispatchEvent(new Event("session:changed"));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("session:changed"));
}
