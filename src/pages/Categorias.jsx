import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { list } from "../data/catalog"; // usamos el catálogo para derivar categorías

export default function Categorias() {
  const navigate = useNavigate();

  // Derivamos categorías únicas desde los productos
  const categorias = useMemo(() => {
    const nombres = Array.from(new Set(list().map(p => p.categoria))).sort();
    // Elegimos una imagen representativa: el primer producto de cada categoría
    const porNombre = {};
    for (const cat of nombres) {
      const prod = list().find(p => p.categoria === cat);
      porNombre[cat] = {
        nombre: cat,
        img: prod?.imagen || "/img/logo.jpg"
      };
    }
    return nombres.map(n => porNombre[n]);
  }, []);

  return (
    <section>
      <h1 className="title">Categorías</h1>

      {categorias.length === 0 ? (
        <p className="text-muted">Aún no hay categorías registradas.</p>
      ) : (
        <div className="cat-grid">
          {categorias.map(c => (
            <article key={c.nombre} className="cat-card">
              <img src={c.img} alt={c.nombre} className="cat-img" />
              <div className="cat-body">
                <h3>{c.nombre}</h3>
                <button
                  className="btn"
                  onClick={() => navigate(`/productos?cat=${encodeURIComponent(c.nombre)}`)}
                >
                  Ver productos
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
