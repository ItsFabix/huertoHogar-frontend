// Catálogo administrable guardado en LocalStorage.
// Provee CRUD y hace seed automático la 1ª vez.

const LS_KEY = "productosAdmin";

// --- IO LocalStorage ---
function read() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}
function write(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
  // Notifica a la app que el catálogo cambió
  window.dispatchEvent(new Event("catalog:change"));
}

// --- Semilla inicial (igual al proyecto antiguo) ---
const PRODUCTS_SEED = [
  // Frutas Frescas
  {
    codigo: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    precio: 1200,
    stock: 150,
    descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
    imagen: "img/manzana.jpg",
    oferta: true
  },
  {
    codigo: "FR002",
    nombre: "Naranjas Valencia",
    categoria: "Frutas Frescas",
    precio: 1000,
    stock: 200,
    descripcion: "Jugosas y ricas en vitamina C, ideales para jugos frescos.",
    imagen: "img/naranja.jpg",
    oferta: false
  },
  {
    codigo: "FR003",
    nombre: "Plátanos Cavendish",
    categoria: "Frutas Frescas",
    precio: 800,
    stock: 250,
    descripcion: "Plátanos maduros y dulces, ricos en potasio.",
    imagen: "img/platano.jpg",
    oferta: false
  },

  // Verduras Orgánicas
  {
    codigo: "VR001",
    nombre: "Zanahorias Orgánicas",
    categoria: "Verduras Orgánicas",
    precio: 900,
    stock: 100,
    descripcion: "Zanahorias crujientes sin pesticidas.",
    imagen: "img/zanahoria.jpg",
    oferta: true
  },
  {
    codigo: "VR002",
    nombre: "Espinacas Frescas",
    categoria: "Verduras Orgánicas",
    precio: 700,
    stock: 80,
    descripcion: "Espinacas frescas y nutritivas.",
    imagen: "img/espinaca.jpg",
    oferta: false
  },
  {
    codigo: "VR003",
    nombre: "Pimientos Tricolores",
    categoria: "Verduras Orgánicas",
    precio: 1500,
    stock: 120,
    descripcion: "Pimientos rojos, amarillos y verdes.",
    imagen: "img/pimenton.jpg",
    oferta: false
  },

  // Productos Orgánicos
  {
    codigo: "PO001",
    nombre: "Miel Orgánica",
    categoria: "Productos Orgánicos",
    precio: 5000,
    stock: 50,
    descripcion: "Miel pura y orgánica de apicultores locales.",
    imagen: "img/miel.jpg",
    oferta: true
  },
  {
    codigo: "PO003",
    nombre: "Quinua Orgánica",
    categoria: "Productos Orgánicos",
    precio: 700,
    stock: 40,
    descripcion:
      "Quinua orgánica 100% natural, rica en proteínas, fibra y minerales esenciales. Ideal para ensaladas, guisos y acompañamientos saludables.",
    imagen: "img/quinua.png",
    oferta: false
  },

  // Lácteos
  {
    codigo: "PL001",
    nombre: "Leche Entera",
    categoria: "Productos Lácteos",
    precio: 1500,
    stock: 100,
    descripcion:
      "Leche entera fresca y nutritiva, fuente natural de calcio y proteínas, perfecta para desayunos, batidos y recetas caseras.",
    imagen: "img/leche.png",
    oferta: false
  }
];

// Seed 1ª vez
if (!read().length) {
  write(PRODUCTS_SEED);
}

// --- API pública (usada por Admin, Productos, etc.) ---
export function list() {
  return read();
}
export function getByCode(codigo) {
  return read().find(p => p.codigo === codigo) || null;
}
export function saveList(arr) {
  write(Array.isArray(arr) ? arr : []);
  return list();
}
export function create(prod) {
  const arr = read();
  if (!prod || !prod.codigo) throw new Error("Producto inválido.");
  if (arr.some(p => p.codigo === prod.codigo)) throw new Error("Código ya existe.");
  arr.push({
    ...prod,
    precio: Number(prod.precio) || 0,
    stock: Number(prod.stock) || 0
  });
  write(arr);
  return prod;
}
export function update(codigo, patch) {
  const arr = read();
  const i = arr.findIndex(p => p.codigo === codigo);
  if (i < 0) throw new Error("No existe el producto.");
  const next = {
    ...arr[i],
    ...patch,
    codigo: arr[i].codigo,
    precio: Number(patch?.precio ?? arr[i].precio) || 0,
    stock: Number(patch?.stock ?? arr[i].stock) || 0
  };
  arr[i] = next;
  write(arr);
  return next;
}
export function remove(codigo) {
  const arr = read();
  const i = arr.findIndex(p => p.codigo === codigo);
  if (i < 0) return false;
  arr.splice(i, 1);
  write(arr);
  return true;
}
export function incStock(codigo, n = 1) {
  const p = getByCode(codigo);
  if (!p) return null;
  return update(codigo, { stock: Number(p.stock || 0) + Number(n) });
}
export function decStock(codigo, n = 1) {
  const p = getByCode(codigo);
  if (!p) return null;
  const v = Math.max(0, Number(p.stock || 0) - Number(n));
  return update(codigo, { stock: v });
}
export function listCategories() {
  const set = new Set(list().map(p => p.categoria).filter(Boolean));
  return Array.from(set);
}
export function listOffers() {
  return list().filter(p => !!p.oferta);
}
