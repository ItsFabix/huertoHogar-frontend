/* eslint-disable no-alert */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, setCart, inc, dec, removeFromCart, clearCart, itemsCount } from "../utils/cart";
import { createOrder } from "../services/orderService";
import { getAllProducts } from "../services/productService"; // IMPORTANTE: Para actualizar precios
import { getSession } from "../utils/auth";
import { REGIONES } from "../data/regiones";

export default function Carrito() {
  const [cartItems, setCartItems] = useState([]); // Estado local del carrito sincronizado
  const [totales, setTotales] = useState({ sub: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const session = getSession();

  const [form, setForm] = useState({
    nombre: session?.nombre?.split(" ")[0] || "",
    apellidos: session?.nombre?.split(" ").slice(1).join(" ") || "",
    correo: session?.correo || "",
    calle: "", depto: "", region: "", comuna: "", indicaciones: ""
  });

  const [pago, setPago] = useState({ numero: "", expiracion: "", cvv: "" });

  // --- LÓGICA DE SINCRONIZACIÓN (NUEVA) ---
  // Al cargar, pedimos los productos al servidor para tener los precios frescos
  useEffect(() => {
    async function syncCart() {
      const localCart = getCart();
      if (localCart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const serverProducts = await getAllProducts();

        // Cruzamos los datos: Usamos cantidad del carrito pero PRECIOS del servidor
        const updatedCart = localCart.map(localItem => {
          const serverItem = serverProducts.find(p => p.codigo === localItem.codigo);

          if (serverItem) {
            // Si el producto existe, actualizamos sus datos críticos
            return {
              ...localItem,
              precio: serverItem.precio,
              precioOferta: serverItem.precioOferta,
              oferta: serverItem.oferta,
              nombre: serverItem.nombre,
              imagen: serverItem.imagen
            };
          }
          return localItem; // Si no se encuentra (raro), dejamos el local
        });

        setCartItems(updatedCart);
        // Opcional: Actualizar localStorage con los datos frescos
        setCart(updatedCart);
      } catch (error) {
        console.error("Error sincronizando precios", error);
        setCartItems(localCart); // Fallback
      } finally {
        setLoading(false);
      }
    }

    syncCart();
  }, []);

  // Calcular precio final por item
  function getFinalPrice(p) {
    const precioNormal = Number(p.precio) || 0;
    const precioOferta = Number(p.precioOferta) || 0;
    // Si la oferta es válida y menor al normal, gana la oferta
    if (precioOferta > 0 && precioOferta < precioNormal) {
      return precioOferta;
    }
    return precioNormal;
  }

  // Recalcular totales cada vez que cambien los items
  useEffect(() => {
    const sub = cartItems.reduce((s, p) => {
      const precioReal = getFinalPrice(p);
      return s + (Number(precioReal) * (Number(p.cantidad) || 0));
    }, 0);
    setTotales({ sub, total: sub });
  }, [cartItems]);

  // Manejadores
  const updateQuantity = (codigo, delta) => {
    const nextCart = cartItems.map(item => {
      if (item.codigo === codigo) {
        const newQty = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQty };
      }
      return item;
    });
    setCartItems(nextCart);
    setCart(nextCart); // Guardar en storage
  };

  const handleManualQty = (codigo, val) => {
    const newQty = parseInt(val);
    if (!isNaN(newQty) && newQty >= 1) {
      const nextCart = cartItems.map(item => (item.codigo === codigo ? { ...item, cantidad: newQty } : item));
      setCartItems(nextCart);
      setCart(nextCart);
    }
  };

  const handleRemove = (codigo) => {
    const nextCart = cartItems.filter(item => item.codigo !== codigo);
    setCartItems(nextCart);
    setCart(nextCart);
    removeFromCart(codigo); // Actualizar utilidad global
  };

  const comunas = useMemo(() => {
    if (!form.region) return [];
    const reg = REGIONES.find(r => r.nombre === form.region);
    return reg ? reg.comunas : [];
  }, [form.region]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePagoChange = (e) => setPago({ ...pago, [e.target.name]: e.target.value });

  async function confirmarCompra() {
    if (!itemsCount()) return alert("Tu carrito está vacío.");
    if (!session) { alert("Debes iniciar sesión."); return nav("/login"); }
    if (!form.calle || !form.region || !form.comuna) return alert("Completa la dirección.");

    try {
      const direccionCompleta = `${form.calle} ${form.depto || ""}, ${form.comuna}, ${form.region}. (${form.indicaciones || ""})`;
      const nuevaBoleta = await createOrder(cartItems, direccionCompleta);
      clearCart(); // Limpiar storage
      setCartItems([]); // Limpiar estado visual
      nav("/compra-exitosa", { state: { order: nuevaBoleta, buyerDetails: form, items: cartItems } });
    } catch (err) {
      nav("/compra-fallida", { state: { error: err.message, buyerDetails: form, items: cartItems, total: totales.total } });
    }
  }

  if (loading) return <section className="container mt-16 text-center"><p>Actualizando precios...</p></section>;
  if (!cartItems.length) return <section className="container mt-16 text-center"><h2>Tu carrito está vacío 🛒</h2><p>Agrega productos para comenzar.</p></section>;

  return (
    <section className="container" style={{ maxWidth: '1000px' }}>
      <div className="panel mt-16">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Carrito de compra</h1>
          <div style={{ background: '#e8f5e9', color: '#2E8B57', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Total a Pagar: ${totales.total.toLocaleString("es-CL")}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead><tr><th>Producto</th><th style={{ textAlign: 'right' }}>Precio Unit.</th><th style={{ textAlign: 'center' }}>Cant.</th><th style={{ textAlign: 'right' }}>Subtotal</th><th></th></tr></thead>
            <tbody>
              {cartItems.map((p) => {
                const precioUnitario = getFinalPrice(p);
                const precioNormal = Number(p.precio);
                const esOferta = precioUnitario < precioNormal;

                return (
                  <tr key={p.codigo}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={p.imagen || "/img/logo.jpg"} style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover', border: '1px solid #eee' }} alt="" />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '1rem' }}>{p.nombre}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>Cód: {p.codigo}</div>
                          {esOferta && <span style={{ fontSize: '0.7rem', background: '#d32f2f', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>OFERTA APLICADA</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {esOferta ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>${precioNormal.toLocaleString("es-CL")}</span>
                          <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>${precioUnitario.toLocaleString("es-CL")}</span>
                        </div>
                      ) : (
                        <span style={{ fontWeight: '600' }}>${precioUnitario.toLocaleString("es-CL")}</span>
                      )}
                    </td>
                    <td>
                      <div className="qty" style={{ justifyContent: 'center' }}>
                        <button type="button" onClick={() => updateQuantity(p.codigo, -1)}>-</button>
                        <input
                          type="number"
                          min="1"
                          value={p.cantidad}
                          onChange={(e) => handleManualQty(p.codigo, e.target.value)}
                          onFocus={(e) => e.target.select()}
                          style={{ width: '60px', textAlign: 'center', border: 'none', fontWeight: 'bold', background: 'transparent' }}
                        />
                        <button type="button" onClick={() => updateQuantity(p.codigo, 1)}>+</button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1rem' }}>
                      ${(precioUnitario * p.cantidad).toLocaleString("es-CL")}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-outline" style={{ padding: '4px 8px', color: '#d32f2f', borderColor: '#d32f2f' }} onClick={() => handleRemove(p.codigo)} title="Eliminar">✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>1. Dirección de envío</h3>
            <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '15px' }}>
              <div><label className="lbl">Calle y Número</label><input className="input" name="calle" value={form.calle} onChange={handleFormChange} placeholder="Ej: Av. Siempreviva 123" /></div>
              <div><label className="lbl">Depto/Casa</label><input className="input" name="depto" value={form.depto} onChange={handleFormChange} placeholder="Opcional" /></div>
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '15px' }}>
              <div><label className="lbl">Región</label><select className="input" name="region" value={form.region} onChange={handleFormChange}><option value="">Seleccione...</option>{REGIONES.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}</select></div>
              <div><label className="lbl">Comuna</label><select className="input" name="comuna" value={form.comuna} onChange={handleFormChange} disabled={!form.region}><option value="">Seleccione...</option>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div><label className="lbl">Indicaciones adicionales (Opcional)</label><textarea className="input" name="indicaciones" value={form.indicaciones} onChange={handleFormChange} rows="2" placeholder="Ej: Dejar en conserjería, timbre malo..." /></div>
          </div>

          <div>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>2. Método de Pago</h3>
            <div className="panel" style={{ background: '#f8f9fa', border: '1px solid #eee', padding: '25px' }}>
              <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
                <span style={{ fontSize: '1.5rem' }}>🏦</span>
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div><label className="lbl">Número de Tarjeta</label><input className="input" name="numero" maxLength="19" placeholder="0000 0000 0000 0000" value={pago.numero} onChange={handlePagoChange} style={{ fontFamily: 'monospace', fontSize: '1.1rem' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div><label className="lbl">Vencimiento</label><input className="input" name="expiracion" maxLength="5" placeholder="MM/AA" value={pago.expiracion} onChange={handlePagoChange} style={{ textAlign: 'center' }} /></div>
                  <div><label className="lbl">CVV</label><input className="input" name="cvv" maxLength="4" type="password" placeholder="123" value={pago.cvv} onChange={handlePagoChange} style={{ textAlign: 'center' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '30px' }}>
          <p className="text-muted" style={{ marginBottom: '20px' }}>Al confirmar, aceptas los términos y condiciones.</p>
          <button className="btn" style={{ fontSize: '1.3rem', padding: '15px 50px', background: '#2E8B57', boxShadow: '0 4px 10px rgba(46, 139, 87, 0.3)' }} onClick={confirmarCompra}>
            Confirmar y Pagar <b>${totales.total.toLocaleString("es-CL")}</b>
          </button>
        </div>
      </div>
    </section>
  );
}