import { Link } from "react-router-dom";

const BLOGS = [
  {
    id: 1,
    titulo: "Tip rápido: manzanas listas",
    bajada: "Tres pistas para elegir la Fuji perfecta y conservarla.",
    imagen: "/img/blog1.png"
  },
  {
    id: 2,
    titulo: "Lácteos: cadena de frío en tienda",
    bajada: "Cómo mantenemos la cadena de frío y tips de traslado.",
    imagen: "/img/blog2.png"
  }
];

export default function Blog(){
  return (
    <section>
      <h1 className="titulo-blog">Noticias & Curiosidades</h1>
      <div className="blog-list grid">
        {BLOGS.map(b => (
          <article className="card blog-card" key={b.id}>
            <img className="blog-banner" src={b.imagen} alt={b.titulo} />
            <div className="body">
              <h3 className="blog-title">{b.titulo}</h3>
              <p className="blog-bajada">{b.bajada}</p>
              <Link to={`/blog/${b.id}`} className="blog-link">Leer más →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}




