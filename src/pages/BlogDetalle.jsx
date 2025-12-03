import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";

// Importante: guarda las imágenes en public/img/...
// y refiérelas como "/img/archivo.png"
const POSTS = [
  {
    id: 1,
    titulo: "Tip rapido: manzanas listas",
    imagen: "/img/blog1.png",
    html: `
      <p>Cuando el color esta uniforme y el aroma es fresco, tu <b>Fuji</b> esta lista para comer. La firmeza debe ser alta, sin zonas blandas.</p>
      <p>Para conservarlas, guardalas en el refrigerador dentro del cajon de frutas: asi prolongas su crocancia.</p>
      <p>En tienda mostramos el precio por unidad y el codigo del producto tal como lo veras en la ficha; asi puedes identificarla facil en la web.</p>
    `
  },
  {
    id: 2,
    titulo: "Lacteos: cadena de frio en tienda",
    imagen: "/img/blog2.png",
    html: `
      <p>Mantenemos los lacteos en refrigeracion continua desde la recepcion hasta la entrega.</p>
      <p>Usa bolsas termicas si haras trayectos largos, especialmente en dias calurosos.</p>
      <p>Revisa la fecha de vencimiento en la ficha; el stock evita ventas sobre disponibilidad real.</p>
    `
  }
];

export default function BlogDetalle() {
  const { id } = useParams();

  // Asegura que id sea número y busca el post
  const post = useMemo(() => {
    const num = Number(id);
    return POSTS.find(p => p.id === num) || null;
  }, [id]);

  if (!post) {
    return (
      <section className="panel">
        <h1>Articulo no encontrado</h1>
        <p>No existe contenido para el id: <code>{id}</code>.</p>
        <Link className="btn" to="/blog">Volver al Blog</Link>
      </section>
    );
  }

  return (
    <section className="panel blog-detalle">
      <img
        src={post.imagen}
        alt={post.titulo}
        className="blog-main-img"
      />
      <h1>{post.titulo}</h1>
      <div
        className="blog-texto"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <Link className="btn-outline btn-volver mt-16" to="/blog">
        Volver al Blog
      </Link>
    </section>
  );
}





