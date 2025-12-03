import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { getAllProducts } from "../services/productService";

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getAllProducts().then(data => {
      // Mostramos los primeros 4 productos destacados
      setProductos(data.slice(0, 4)); 
    });
  }, []);

  // Función para calcular precios asegurando que sean números
  const getProductData = (p) => {
    const original = parseInt(p.precio, 10) || 0;
    const oferta = parseInt(p.precioOferta, 10) || 0;
    
    // Si la oferta es mayor a 0 y menor al precio original, es válida.
    // Esto funciona aunque el checkbox de oferta esté desmarcado por error en BD.
    const tieneOferta = oferta > 0 && oferta < original;
    
    return {
      precioMostrar: tieneOferta ? oferta : original,
      precioOriginal: original,
      esOferta: tieneOferta
    };
  };

  // Estilos del Banner
  const styles = {
    hero: {
      position: 'relative',
      width: '100%',
      height: '500px', // Más alto para que se luzca
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '50px',
      boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
    },
    heroBg: {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundImage: "url('/img/portada.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 1
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)', // Degradado elegante
      zIndex: 2
    },
    heroContent: {
      position: 'relative',
      zIndex: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start', // Alineado a la izquierda para estilo moderno
      padding: '0 60px',
      color: 'white'
    },
    heroTitle: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '4rem',
      fontWeight: 700,
      marginBottom: '15px',
      lineHeight: 1.1,
      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    heroText: {
      fontSize: '1.4rem',
      marginBottom: '30px',
      maxWidth: '600px',
      opacity: 0.9,
      lineHeight: 1.5
    },
    heroBtn: {
      padding: '15px 40px',
      fontSize: '1.2rem',
      background: '#2E8B57',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      textDecoration: 'none',
      boxShadow: '0 5px 15px rgba(46, 139, 87, 0.4)',
      transition: 'transform 0.2s',
      fontWeight: '600'
    }
  };

  return (
    <section>
      {/* BANNER PRINCIPAL */}
      <div style={styles.hero}>
        <div style={styles.heroBg}></div>
        <div style={styles.overlay}></div>
        
        <div style={styles.heroContent}>
          <h1 style={{...styles.heroTitle, color: '#c46d2fff'}}>HuertoHogar</h1>
          <p style={styles.heroText}>
            La frescura del campo chileno, seleccionada cuidadosamente y entregada directo en tu puerta.
          </p>
          <Link 
            to="/productos" 
            style={styles.heroBtn}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Ver Productos
          </Link>
        </div>
      </div>

      <h2 style={{textAlign:'center', marginBottom:'40px', fontSize:'2.5rem', fontFamily:'"Playfair Display", serif'}}>
        Favoritos de la Temporada
      </h2>
      
      {/* GRILLA DE PRODUCTOS */}
      <div className="grid-prods">
        {productos.map(p => {
          const { precioMostrar, precioOriginal, esOferta } = getProductData(p);

          return (
            <article key={p.codigo} className="prod-card">
              {esOferta && <div className="offer-flag">OFERTA</div>}
              
              <div style={{height: 220, overflow: 'hidden', borderBottom: '1px solid #eee'}}>
                <img
                  className="prod-img"
                  src={p.imagen || "/img/manzana.jpg"}
                  alt={p.nombre}
                  style={{width:'100%', height:'100%', objectFit:'cover'}}
                />
              </div>
              
              <div style={{padding:'20px'}}>
                <h3 className="prod-name" style={{fontSize:'1.3rem', marginBottom:'10px'}}>{p.nombre}</h3>

                <div className="prod-price" style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
                  {esOferta ? (
                    <>
                      <span className="old" style={{textDecoration:'line-through', color:'#999', fontSize:'1rem'}}>
                        ${precioOriginal.toLocaleString("es-CL")}
                      </span>
                      <b style={{fontSize:'1.6rem', color:'#d32f2f'}}>
                        ${precioMostrar.toLocaleString("es-CL")}
                      </b>
                    </>
                  ) : (
                    <b style={{fontSize:'1.6rem', color:'#333'}}>
                      ${precioOriginal.toLocaleString("es-CL")}
                    </b>
                  )}
                </div>

                <div className="actions">
                  <button
                    className="btn"
                    style={{width:'100%', padding:'12px', fontSize:'1rem'}}
                    onClick={() => addToCart(p)}
                    disabled={p.stock <= 0}
                  >
                    {p.stock > 0 ? "Añadir al Carrito" : "Sin Stock"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}