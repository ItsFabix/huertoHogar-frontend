import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService"; // Usamos el servicio real

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Cargar órdenes desde el backend
    getMyOrders().then(data => setOrders(data));
  }, []);

  return (
    <section>
      <h1>Mis Órdenes</h1>
      {!orders.length ? <p>No has realizado compras todavía.</p> : (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.folio}</td>
                  <td>{new Date(o.fecha).toLocaleString()}</td>
                  <td>${Number(o.total).toLocaleString("es-CL")}</td>
                  <td>{o.estado}</td>
                  <td>
                    <Link className="btn-outline" to={`/orden/${o.id}`}>
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}