
const AUTH_KEY = "usuariosAuth";   // [{correo, pass, nombre, apellidos, rut?}]
const SESSION_KEY = "currentUser"; // {correo, nombre}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || [];
  } catch {
    return [];
  }
}
export function setUsers(arr) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
}
export function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.correo?.toLowerCase() === String(email).toLowerCase());
}
export function addUser(user) {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("session:changed"));
}
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("session:changed"));
}

export function getUserRole() {
  const session = getSession();
  if (!session || !session.token) return null;

  try {
    // Decodificamos la parte del medio del JWT (Payload)
    const base64Url = session.token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.role; // Retornamos el rol ("admin" o "cliente")
  } catch (e) {
    return null;
  }
}