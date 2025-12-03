import { list as catalogList } from "../data/catalog";

// ===== CLAVE EN LOCALSTORAGE =====
const LS_KEY_CART = "carrito";

// ----- util local -----
function emitCartChange() {
  // evento personalizado para que la UI se entere del cambio
  window.dispatchEvent(new Event("cart:change"));
}

// ===== Helpers de almacenamiento =====
export function getCart() {
  try {
    const raw = localStorage.getItem(LS_KEY_CART);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(arr) {
  const safe = Array.isArray(arr) ? arr : [];
  localStorage.setItem(LS_KEY_CART, JSON.stringify(safe));
  emitCartChange();
}

// ===== Operaciones de carrito =====
export function addToCart(product, qty = 1) {
  if (!product || !product.codigo) return;
  const cart = getCart();
  const idx = cart.findIndex((i) => i.codigo === product.codigo);
  if (idx >= 0) {
    cart[idx].cantidad = Number(cart[idx].cantidad || 0) + Number(qty || 1);
  } else {
    cart.push({
      codigo: product.codigo,
      nombre: product.nombre,
      precio: Number(product.precio) || 0,
      cantidad: Number(qty) || 1,
      imagen: product.imagen || "",
    });
  }
  setCart(cart);
}

export function inc(codigo) {
  const cart = getCart();
  const i = cart.findIndex(x => x.codigo === codigo);
  if (i >= 0) {
    cart[i].cantidad = Number(cart[i].cantidad || 0) + 1;
    setCart(cart);
  }
}

export function dec(codigo) {
  const cart = getCart();
  const i = cart.findIndex(x => x.codigo === codigo);
  if (i >= 0) {
    cart[i].cantidad = Number(cart[i].cantidad || 0) - 1;
    if (cart[i].cantidad <= 0) cart.splice(i, 1);
    setCart(cart);
  }
}

export function removeFromCart(codigo) {
  const cart = getCart();
  const i = cart.findIndex(x => x.codigo === codigo);
  if (i >= 0) {
    cart.splice(i, 1);
    setCart(cart);
  }
}

export function clearCart() {
  setCart([]);
}

// Totales Ãºtiles
export function getCartCount() {
  return getCart().reduce((s, i) => s + (Number(i.cantidad) || 0), 0);
}

export function itemsCount() {
  return getCartCount();
}
