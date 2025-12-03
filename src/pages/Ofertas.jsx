import { useEffect, useState } from "react";
import { addToCart } from "../utils/cart";
import { Link } from "react-router-dom";
// CAMBIO 1: Importamos el servicio real en lugar del catálogo falso
import { getAllProducts } from "../services/productService";

export default function Ofertas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CAMBIO 2: Pedimos los productos al Backend y filtramos
    getAllProducts().then(data => {
      // Filtramos solo los que tienen la marca de oferta activa Y un precio oferta válido
      const offers = data.filter(p => p.oferta === true && p.precioOferta > 0);
      setItems(offers);
      setLoading(false);
    });
  }, []);

  if (loading) return <section className="container"><p>Cargando ofertas...</p></section>;

  return (
    <section>
      <h1>Ofertas Imperdibles</h1>
      
      {!items.length ? (
        <div className="panel text-center">
          <p className="text-muted">No hay ofertas activas por el momento. ¡Revisa nuestro catálogo completo!</p>
          <Link to="/productos" className="btn" style={{marginTop:10}}>Ver todos los productos</Link>
        </div>
      ) : (
        <div className="grid-prods">
          {items.map(p => (
            <article key={p.codigo} className="prod-card">
              <div className="offer-flag">Oferta</div>
              
              <img
                className="prod-img"
                src={p.imagen || "/img/manzana.jpg"}
                alt={p.nombre}
                loading="lazy"
              />
              
              <h3 className="prod-name">{p.nombre}</h3>

              <div className="prod-price">
                {/* CAMBIO 3: Usamos la estructura de precios del backend */}
                <span className="old">${Number(p.precio).toLocaleString("es-CL")}</span>
                <b>${Number(p.precioOferta).toLocaleString("es-CL")}</b>
              </div>

              <div className="actions">
                <button
                  className="btn"
                  onClick={() => addToCart(p)}
                  disabled={p.stock <= 0}
                  title={p.stock <= 0 ? "Sin stock" : "Añadir al carrito"}
                >
                  {p.stock > 0 ? "Añadir" : "Agotado"}
                </button>
                <span className="stock">
                  {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}