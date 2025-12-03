import { useEffect, useMemo, useState } from "react";
import { getCart, setCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";

export default function Checkout(){
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(()=> setItems(getCart()), []);
  const total = useMemo(()=> items.reduce((s,i)=> s + i.precio*i.cantidad, 0), [items]);

  const pagar = (ok=true) => {
    if (ok) {
      setCart([]); 
      nav("/compra-exitosa");
    } else {
      nav("/compra-fallida");
    }
  };

  if (!items.length) {
    return (
      <main className="container">
        <h1>Checkout</h1>
        <p>No tienes productos en el carrito.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Checkout</h1>
      <div className="panel">
        {items.map((it,i)=>(
          <div key={i} className="d-flex justify-content-between py-2 border-bottom">
            <div>{it.nombre} x {it.cantidad}</div>
            <div>${(it.precio*it.cantidad).toLocaleString("es-CL")}</div>
          </div>
        ))}
        <h3 className="mt-3">Total: ${total.toLocaleString("es-CL")}</h3>
        <div className="actions mt-2">
          <button className="btn" onClick={()=>pagar(true)}>Pagar</button>
          <button className="btn-outline" onClick={()=>pagar(false)}>Simular fallo</button>
        </div>
      </div>
    </main>
  );
}
