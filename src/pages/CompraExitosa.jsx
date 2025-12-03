import { useLocation, Link } from "react-router-dom";

export default function CompraExitosa() {
  const location = useLocation();
  // Usamos "|| {}" para evitar el crash si location.state es null
  const { order, buyerDetails, items } = location.state || {};

  // Si no hay orden, mostramos un mensaje amigable y un botón para volver
  if (!order || !buyerDetails) {
    return (
      <section className="container text-center" style={{marginTop: 80, textAlign: 'center'}}>
        <div style={{fontSize: '60px', marginBottom: '20px'}}>⚠️</div>
        <h1>No se encontró información de la compra</h1>
        <p className="text-muted">Tal vez recargaste la página o accediste directamente.</p>
        <Link className="btn" to="/" style={{marginTop: '20px', display: 'inline-block'}}>
          Volver al Inicio
        </Link>
      </section>
    );
  }

  const total = order.total || 0;

  // Función para el botón de Email
  const handleEmail = () => {
    const subject = `Comprobante de compra #${order.folio}`;
    const body = `Hola ${buyerDetails.nombre},\n\nTu compra por $${total} fue exitosa.\nNro de Orden: ${order.folio}\n\nGracias por preferirnos.`;
    window.location.href = `mailto:${buyerDetails.correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="container" style={{maxWidth: '800px'}}>
      <div className="panel mt-16" style={{textAlign:'center', padding:'40px 20px'}}>
        
        <div style={{color:'#2E8B57', fontSize:'60px', marginBottom:'10px'}}>✓</div>
        <h2 style={{color:'#333'}}>Se ha realizado la compra nro #{order.folio}</h2>
        <p className="text-muted">Código orden: {order.folio}</p>

        {/* Resumen Datos Cliente */}
        <div style={{background:'#f8f9fa', padding:'20px', borderRadius:'10px', textAlign:'left', margin:'30px 0'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px'}}>
            <div>
              <small className="text-muted">Nombre</small>
              <div style={{fontWeight:600}}>{buyerDetails.nombre} {buyerDetails.apellidos}</div>
            </div>
            <div>
              <small className="text-muted">Correo</small>
              <div style={{fontWeight:600}}>{buyerDetails.correo}</div>
            </div>
          </div>

          <h4 style={{borderBottom:'1px solid #ddd', paddingBottom:'5px', marginBottom:'15px'}}>Dirección de entrega</h4>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px', marginBottom:'10px'}}>
             <div>
                <small className="text-muted">Calle</small>
                <div>{buyerDetails.calle}</div>
             </div>
             <div>
                <small className="text-muted">Depto</small>
                <div>{buyerDetails.depto || "-"}</div>
             </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
             <div>
                <small className="text-muted">Región</small>
                <div>{buyerDetails.region}</div>
             </div>
             <div>
                <small className="text-muted">Comuna</small>
                <div>{buyerDetails.comuna}</div>
             </div>
          </div>
          {buyerDetails.indicaciones && (
            <div style={{marginTop:'15px', background:'#fff', padding:'10px', borderRadius:'6px', border:'1px solid #eee'}}>
               <small className="text-muted">Indicaciones:</small>
               <p style={{margin:0, fontSize:'0.9rem'}}>{buyerDetails.indicaciones}</p>
            </div>
          )}
        </div>

        {/* Resumen Productos */}
        <table className="table" style={{textAlign:'left'}}>
          <thead>
             <tr>
               <th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cant.</th><th>Total</th>
             </tr>
          </thead>
          <tbody>
            {items && items.map((p, i) => (
              <tr key={i}>
                 <td style={{width:60}}><img src={p.imagen || "/img/logo.jpg"} alt="" style={{width:40, height:40, borderRadius:4, objectFit:'cover'}}/></td>
                 <td>{p.nombre}</td>
                 <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                 <td>{p.cantidad}</td>
                 <td>${(p.precio * p.cantidad).toLocaleString("es-CL")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="panel" style={{marginTop:'20px', background:'#fff', border:'1px solid #eee'}}>
           <h2 style={{margin:0}}>Total pagado: ${total.toLocaleString("es-CL")}</h2>
        </div>

        {/* BOTONES CORREGIDOS */}
        <div className="actions" style={{justifyContent:'center', marginTop:'30px', gap:'15px'}}>
           <button className="btn" style={{background:'#d32f2f'}} onClick={()=> window.print()}>
             Imprimir boleta en PDF
           </button>

           <button className="btn" style={{background:'#2E8B57'}} onClick={handleEmail}>
             Enviar boleta por email
           </button>

           <Link className="btn-outline" to="/">Volver al inicio</Link>
        </div>

      </div>
    </section>
  );
}