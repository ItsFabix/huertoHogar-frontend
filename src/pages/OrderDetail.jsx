import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then(data => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  // Función para asegurar que las imágenes se vean
  const fixImgPath = (path) => {
    if (!path) return "/img/logo.jpg";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/${path}`;
  };

  if (loading) return <p className="container text-center mt-16">Cargando boleta...</p>;
  if (!order) return <p className="container text-center mt-16">Orden no encontrada.</p>;

  const u = order.usuario || {};
  const isPagada = order.estado === "pagada";
  
  // Colores y estilos según estado
  const statusColor = isPagada ? "#2E8B57" : "#d32f2f";
  const statusBg = isPagada ? "#e8f5e9" : "#ffebee";
  const statusIcon = isPagada ? "✓" : "×";

  // Botón Email (Abre el cliente de correo)
  const handleEmail = () => {
    const subject = `Comprobante de compra #${order.folio}`;
    const body = `Hola ${u.nombre},\n\nAquí está el detalle de tu compra.\nTotal: $${order.total}\n\nAtte, HuertoHogar.`;
    window.location.href = `mailto:${u.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="container" style={{maxWidth: '800px'}}>
      <div className="panel mt-16" style={{padding:'40px', borderRadius:'12px', textAlign:'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
        
        {/* Icono Check */}
        <div style={{color: statusColor, fontSize:'60px', marginBottom:'5px', lineHeight: 1}}>{statusIcon}</div>
        
        {/* Título */}
        <h1 style={{fontFamily: '"Playfair Display", serif', fontSize:'2.5rem', margin:'0 0 5px', color:'#333'}}>
          Boleta Nro <span style={{color:'#666'}}>#{order.folio}</span>
        </h1>
        
        <p style={{color:'#888', margin:'0 0 15px', fontSize:'0.9rem'}}>
          Fecha de emisión: {new Date(order.fecha).toLocaleString()}
        </p>

        <span style={{ background: statusBg, color: statusColor, padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '30px' }}>
          {order.estado}
        </span>

        {/* Datos del Cliente */}
        <div style={{textAlign:'left'}}>
          <h3 style={{fontSize:'1.1rem', color:'#555', borderBottom:'1px solid #eee', paddingBottom:'8px', marginBottom:'15px'}}>Datos del Cliente</h3>
          <div style={{background:'#f9fafb', padding:'20px', borderRadius:'8px', border:'1px solid #eee'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
              
              <div>
                <small style={{color:'#888', display:'block', marginBottom:'4px'}}>Nombre</small>
                <div style={{fontWeight:'600', color:'#333'}}>{u.nombre}</div>
              </div>
              
              <div>
                <small style={{color:'#888', display:'block', marginBottom:'4px'}}>Correo</small>
                <div style={{fontWeight:'600', color:'#333'}}>{u.email}</div>
              </div>
              
              <div>
                <small style={{color:'#888', display:'block', marginBottom:'4px'}}>RUT</small>
                <div style={{fontWeight:'600', color:'#333'}}>{u.rut || "-"}</div>
              </div>
              
              <div>
                <small style={{color:'#888', display:'block', marginBottom:'4px'}}>Método de pago</small>
                <div style={{fontWeight:'600', color:'#333'}}>Débito/Crédito</div>
              </div>
              
              {/* DIRECCIÓN DE ENVÍO (Aquí se mostrará lo que guardaste) */}
              <div style={{gridColumn: 'span 2', borderTop:'1px dashed #e0e0e0', paddingTop:'15px', marginTop:'5px'}}>
                <small style={{color:'#888', display:'block', marginBottom:'4px'}}>Dirección de envío</small>
                <div style={{fontWeight:'500', color:'#444'}}>
                   {order.direccionEnvio || <span style={{color:'#999', fontStyle:'italic'}}>Dirección no registrada para esta compra.</span>}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detalle de productos */}
        <div style={{marginTop:'40px', textAlign:'left'}}>
          <h3 style={{fontSize:'1.1rem', color:'#555', borderBottom:'1px solid #eee', paddingBottom:'8px', marginBottom:'15px'}}>Detalle de productos</h3>
          <table className="table" style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
               <tr style={{background:'#fff', color:'#888', fontSize:'0.85rem', borderBottom:'2px solid #f0f0f0'}}>
                 <th style={{padding:'10px', textAlign:'left'}}>PRODUCTO</th>
                 <th style={{padding:'10px', textAlign:'right'}}>PRECIO</th>
                 <th style={{padding:'10px', textAlign:'center'}}>CANT.</th>
                 <th style={{padding:'10px', textAlign:'right'}}>TOTAL</th>
               </tr>
            </thead>
            <tbody>
              {order.detalles.map((item, i) => (
                <tr key={i} style={{borderBottom:'1px solid #f9f9f9'}}>
                   <td style={{padding:'12px 10px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                          {/* Imagen */}
                          <img 
                            src={fixImgPath(item.producto?.imagen)} 
                            alt="" 
                            style={{width:48, height:48, borderRadius:6, objectFit:'cover', border:'1px solid #eee'}}
                          />
                          <span style={{fontWeight:'500', color:'#444'}}>
                            {item.producto ? item.producto.nombre : "Producto eliminado"}
                          </span>
                      </div>
                   </td>
                   <td style={{padding:'10px', textAlign:'right', color:'#666'}}>${Number(item.precioUnitario).toLocaleString("es-CL")}</td>
                   <td style={{padding:'10px', textAlign:'center', color:'#666'}}>{item.cantidad}</td>
                   <td style={{padding:'10px', textAlign:'right', fontWeight:'700', color:'#333'}}>${(item.precioUnitario * item.cantidad).toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Final */}
        <div style={{marginTop:'30px', borderTop:'2px solid #eee', paddingTop:'25px', display:'flex', justifyContent:'center'}}>
            <div style={{background:'#fff8e1', padding:'10px 30px', borderRadius:'8px', border:'1px solid #ffe082'}}>
                <h2 style={{fontFamily:'"Playfair Display", serif', fontSize:'2.2rem', color:'#8B4513', margin:0}}>Total: ${order.total.toLocaleString("es-CL")}</h2>
            </div>
        </div>

        {/* Botones de Acción */}
        <div className="actions" style={{justifyContent:'center', marginTop:'40px', gap:'15px', flexWrap:'wrap'}}>
           <button className="btn" style={{background:'#d32f2f', padding:'12px 25px'}} onClick={()=> window.print()}>Guardar como PDF</button>
           <button className="btn" style={{background:'#2E8B57', padding:'12px 25px'}} onClick={handleEmail}>Enviar por Email</button>
           <Link className="btn-outline" to="/ordenes" style={{padding:'12px 25px'}}>Volver</Link>
        </div>

      </div>
    </section>
  );
}