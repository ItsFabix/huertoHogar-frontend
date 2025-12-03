import { useLocation, Link } from "react-router-dom";

export default function CompraFallida() {
  const location = useLocation();
  // Protección contra null/undefined
  const { error, buyerDetails, total } = location.state || {};

  // Si no hay datos de error, mostramos mensaje genérico
  if (!buyerDetails) {
     return (
      <section className="container text-center" style={{marginTop: 80, textAlign: 'center'}}>
        <h1>No se detectó ningún error reciente</h1>
        <Link className="btn" to="/">Volver al Inicio</Link>
      </section>
     );
  }

  return (
    <section className="container" style={{maxWidth: '800px'}}>
      <div className="panel mt-16" style={{textAlign:'center', padding:'40px 20px', borderTop:'5px solid #d32f2f'}}>
        
        <div style={{color:'#d32f2f', fontSize:'60px', marginBottom:'10px'}}>ⓧ</div>
        <h2 style={{color:'#333'}}>No se pudo realizar el pago</h2>
        <p className="text-muted">Ocurrió un error al procesar tu solicitud.</p>
        
        {error && (
           <div className="alert" style={{background:'#fff5f5', color:'#c62828', borderColor:'#ffcdd2', display:'inline-block'}}>
             Error: {error}
           </div>
        )}

        <div style={{margin:'20px 0'}}>
            <Link to="/carrito" className="btn" style={{background:'#2E8B57', padding:'10px 30px', fontSize:'1.1rem'}}>
               VOLVER A REALIZAR EL PAGO
            </Link>
        </div>

        {/* Mostramos los datos para que el usuario vea qué falló (Solo lectura visual) */}
        {buyerDetails && (
          <div style={{background:'#f8f9fa', padding:'20px', borderRadius:'10px', textAlign:'left', marginTop:'30px', opacity:0.7}}>
             <h4>Datos ingresados</h4>
             <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'10px'}}>
                <div>
                  <label className="lbl">Nombre</label>
                  <input className="input" value={buyerDetails.nombre} disabled />
                </div>
                <div>
                  <label className="lbl">Apellidos</label>
                  <input className="input" value={buyerDetails.apellidos} disabled />
                </div>
                <div style={{gridColumn:'span 2'}}>
                   <label className="lbl">Dirección</label>
                   <input className="input" value={`${buyerDetails.calle} ${buyerDetails.depto || ""} - ${buyerDetails.comuna}`} disabled />
                </div>
             </div>
             <div style={{textAlign:'center', marginTop:'20px', fontWeight:'bold', fontSize:'1.2rem'}}>
                Monto a pagar: ${Number(total || 0).toLocaleString("es-CL")}
             </div>
          </div>
        )}
      </div>
    </section>
  );
}