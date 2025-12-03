// Persistencia simple en localStorage para Órdenes (compras) + folio de boleta

const KEY = "hh_orders_v1";
const FOLIO_KEY = "hh_orders_folio_v1";

// ====== almacenamiento base ======
function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function write(arr) {
  localStorage.setItem(KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
}

// ====== folio consecutivo ======
function readFolio() {
  const n = Number(localStorage.getItem(FOLIO_KEY));
  return Number.isFinite(n) && n > 0 ? n : 10000; // parte en 10000
}
function nextFolio() {
  const now = readFolio() + 1;
  localStorage.setItem(FOLIO_KEY, String(now));
  return now;
}

// ====== API pública ======
export function listOrders() {
  return read().sort((a,b) => b.date - a.date);
}

export function getOrder(idOrFolio) {
  const all = read();
  return all.find(o =>
    String(o.id) === String(idOrFolio) || String(o.folio) === String(idOrFolio)
  ) || null;
}

export function addOrder(orderLike) {
  const orders = read();
  const id = Date.now();
  const folio = nextFolio();
  const order = { id, folio, status: "pagada", ...orderLike };
  orders.push(order);
  write(orders);
  window.dispatchEvent(new Event("orders:change"));
  return order;
}

export function cancelOrder(idOrFolio) {
  const orders = read();
  const idx = orders.findIndex(o =>
    String(o.id) === String(idOrFolio) || String(o.folio) === String(idOrFolio)
  );
  if (idx >= 0) {
    orders[idx].status = "cancelada";
    write(orders);
    window.dispatchEvent(new Event("orders:change"));
    return true;
  }
  return false;
}

// ===== métricas derivadas =====
export function ordersCount() {
  return listOrders().length;
}
export function revenue() {
  return listOrders()
    .filter(o => o.status !== "cancelada")
    .reduce((s, o) => s + Number(o.total || 0), 0);
}

// ===== helper para construir orden desde carrito =====
export function buildOrderFromCart(cart, buyer) {
  const items = (Array.isArray(cart) ? cart : []).map(p => ({
    codigo: p.codigo,
    nombre: p.nombre,
    precio: Number(p.precio) || 0,
    cantidad: Number(p.cantidad) || 1
  }));
  const subtotal = items.reduce((s,i)=> s + i.precio * i.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  // buyer = { rut, nombre, email, telefono, direccion:{calle,numero,comuna,region}, pago:{metodo}, notas }
  return {
    date: Date.now(),
    items, subtotal, iva, total,
    buyer: {
      rut: buyer?.rut || "",
      nombre: buyer?.nombre || "",
      email: buyer?.email || "",
      telefono: buyer?.telefono || "",
      direccion: {
        calle: buyer?.direccion?.calle || "",
        numero: buyer?.direccion?.numero || "",
        comuna: buyer?.direccion?.comuna || "",
        region: buyer?.direccion?.region || ""
      },
      pago: { metodo: buyer?.pago?.metodo || "Débito/Crédito" },
      notas: buyer?.notas || ""
    },
    status: "pagada"
  };
}

export default {
  listOrders, getOrder, addOrder, cancelOrder,
  ordersCount, revenue, buildOrderFromCart
};
