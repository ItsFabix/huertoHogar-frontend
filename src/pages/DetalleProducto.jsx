import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart } from "../utils/cart";
// Importamos el servicio para obtener los datos reales
import { getAllProducts } from "../services/productService";

export default function DetalleProducto() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscamos el producto en el backend
    getAllProducts().then(products => {
      const found = products.find(p => p.codigo === codigo);
      setProducto(found);
      setLoading(false);
    });
  }, [codigo]);

  const fixImgPath = (path) => {
    if (!path) return "/img/logo.jpg";
    // Si ya tiene / al principio o es url completa, la dejamos igual
    if (path.startsWith("http") || path.startsWith("/")) return path;
    // Si no, le agregamos el / para que busque en la raíz
    return `/${path}`;
  };

  if (loading) return <div className="container mt-16 text-center">Cargando...</div>;
  if (!producto) return <div className="container mt-16 text-center">Producto no encontrado.</div>;

  // Lógica de Precios
  const precioNormal = Number(producto.precio);
  const precioOferta = Number(producto.precioOferta);
  const esOferta = precioOferta > 0 && precioOferta < precioNormal;

  return (
    <section className="container">
      <div className="detalle mt-16">
        
        {/* Columna Imagen */}
        <div className="detalle-img">
          {esOferta && (
            <span style={{
              position:'absolute', 
              background:'#d32f2f', 
              color:'white', 
              padding:'5px 15px', 
              borderRadius:'4px', 
              fontWeight:'bold',
              margin: '10px'
            }}>
              OFERTA
            </span>
          )}
          <img 
            src={fixImgPath(producto.imagen)} 
            alt={producto.nombre} 
            style={{width:'100%', borderRadius:'12px', boxShadow:'0 4px 15px rgba(0,0,0,0.1)'}}
          />
        </div>

        {/* Columna Info */}
        <div className="detalle-info panel" style={{border:'none', boxShadow:'none'}}>
          <h1 style={{fontSize:'2.5rem', marginBottom:'10px'}}>{producto.nombre}</h1>
          <p className="text-muted" style={{fontSize:'1.1rem'}}>Código: {producto.codigo} | Categoría: {producto.categoria}</p>
          
          <div className="precio" style={{fontSize:'2rem', margin:'20px 0', color: esOferta ? '#d32f2f' : '#2E8B57'}}>
            {esOferta ? (
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span style={{textDecoration:'line-through', color:'#999', fontSize:'1.5rem'}}>
                  ${precioNormal.toLocaleString("es-CL")}
                </span>
                <b>${precioOferta.toLocaleString("es-CL")}</b>
              </div>
            ) : (
              <b>${precioNormal.toLocaleString("es-CL")}</b>
            )}
          </div>

          <p className="desc" style={{fontSize:'1.1rem', lineHeight:'1.6', marginBottom:'30px'}}>
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          <div className="acciones">
            <button 
              className="btn" 
              style={{padding:'15px 40px', fontSize:'1.2rem', width:'100%'}}
              onClick={() => addToCart(producto)}
              disabled={producto.stock <= 0}
            >
              {producto.stock > 0 ? "Añadir al Carrito" : "Agotado"}
            </button>
          </div>
          
          <div style={{marginTop:'15px', color: producto.stock < 10 ? '#d32f2f' : '#666'}}>
            Stock disponible: <b>{producto.stock}</b> unidades
          </div>
        </div>

      </div>
    </section>
  );
}

