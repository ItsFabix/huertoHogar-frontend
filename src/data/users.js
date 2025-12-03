// CRUD simple de usuarios (para la sección Admin)

const KEY = "hh_users_v1";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function write(arr) {
  localStorage.setItem(KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
  window.dispatchEvent(new Event("users:change"));
}

export function listUsers() { return read(); }
export function getUser(email) {
  return read().find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}
export function createUser(u) {
  const users = read();
  if (getUser(u.email)) throw new Error("El correo ya existe.");
  users.push({ nombre: u.nombre || "", email: u.email, rol: u.rol || "cliente" });
  write(users);
}
export function updateUser(email, patch) {
  const users = read();
  const i = users.findIndex(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (i < 0) throw new Error("Usuario no encontrado");
  users[i] = { ...users[i], ...patch };
  write(users);
}
export function removeUser(email) {
  const users = read().filter(u => u.email.toLowerCase() !== String(email).toLowerCase());
  write(users);
}

export default { listUsers, getUser, createUser, updateUser, removeUser };
