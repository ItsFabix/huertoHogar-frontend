import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
// CAMBIO 1: Importamos el servicio en vez de "../data/catalog"
import { getAllProducts } from "../services/productService";

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [cat, setCat] = useState(searchParams.get("cat") || "");
  
  // CAMBIO 2: Estado para guardar los productos que vienen del backend
  const [listaProductos, setListaProductos] = useState([]);

  // CAMBIO 3: useEffect para cargar los datos cuando se abre la página
  useEffect(() => {
    getAllProducts().then(data => {
      setListaProductos(data);
    });
  }, []);

  useEffect(() => {
    const n = {};
    if (q) n.q = q;
    if (cat) n.cat = cat;
    setSearchParams(n, { replace: true });
  }, [q, cat, setSearchParams]);

  const productos = useMemo(() => {
    // CAMBIO 4: Usamos 'listaProductos' (del backend) en vez de 'list()'
    let arr = listaProductos; 
    if (cat) arr = arr.filter(p => p.categoria === cat);
    if (q) {
      const t = q.toLowerCase();
      arr = arr.filter(p =>
        (p.nombre || "").toLowerCase().includes(t) ||
        (p.descripcion || "").toLowerCase().includes(t) ||
        (p.categoria || "").toLowerCase().includes(t)
      );
    }
    return arr;
  }, [q, cat, listaProductos]); // Agregamos listaProductos a las dependencias

  // Obtenemos categorías dinámicamente de los productos cargados
  const categorias = useMemo(
    () => Array.from(new Set(listaProductos.map(p => p.categoria))).sort(),
    [listaProductos]
  );

  return (
    <section>
      <h1 className="title">Productos</h1>

      <div className="panel" style={{marginBottom:12}}>
        <div className="actions wrap">
          <input
            className="input"
            placeholder="Buscar por nombre o descripción…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select
            className="input"
            value={cat}
            onChange={e => setCat(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(q || cat) && (
            <button className="btn-outline" onClick={()=>{setQ("");setCat("");}}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="text-muted">Cargando productos o no hay resultados...</p>
      ) : (
        <div className="grid">
          {productos.map(p => {
            const enOferta = p.oferta === true || (p.precioOferta > 0);
            const precioMostrar = enOferta && p.precioOferta > 0 ? p.precioOferta : p.precio;

            return (
              <article key={p.codigo} className="card">
                <div className="img-wrap">
                  {enOferta && <span className="badge-offer">Oferta</span>}
                  {/* Usamos una imagen por defecto si viene null de la BD */}
                  <img src={p.imagen || "/img/manzana.jpg"} alt={p.nombre} />
                </div>
                <div className="card-body">
                  <h3>{p.nombre}</h3>
                  <p className="text-muted">{p.categoria}</p>

                  <div className="price">
                    {enOferta && <span className="old">${Number(p.precio).toLocaleString("es-CL")}</span>}
                    <b>${Number(precioMostrar).toLocaleString("es-CL")}</b>
                  </div>

                  <div className="actions">
                    <button className="btn" onClick={()=>addToCart(p)}>Añadir</button>
                    <Link className="btn-outline" to={`/producto/${p.codigo}`}>Detalle</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}