/* eslint-disable no-alert */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminForm from "../components/AdminForm";
import { 
  adminGetProducts, createProduct, updateProduct, deleteProduct,
  getUsers, deleteUser, updateUser, createUser, getAllOrders
} from "../services/adminService";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";
import { getUserRole } from "../utils/auth";

export default function Admin() {
  const [tab, setTab] = useState("productos"); // productos | ventas | usuarios | categorias
  const [role, setRole] = useState("");
  
  // Datos
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Modales Estados
  const [showModalProd, setShowModalProd] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  const [showModalUser, setShowModalUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Si es null, es CREAR usuario

  const [showModalCat, setShowModalCat] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // Si es null, es CREAR categoría

  useEffect(() => {
    setRole(getUserRole());
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [prods, users, orders, cats] = await Promise.all([
        adminGetProducts(),
        getUsers(),
        getAllOrders(),
        getCategories()
      ]);
      setProductos(prods);
      setUsuarios(users);
      setVentas(orders);
      setCategorias(cats);
    } catch (error) { console.error(error); }
  };

  const totalVentas = ventas.reduce((sum, v) => sum + (v.total || 0), 0);

  // --- LÓGICA PRODUCTOS ---
  const handleSaveProduct = async (form) => {
    try {
      editingProd ? await updateProduct(form) : await createProduct(form);
      setShowModalProd(false); cargarDatos();
    } catch (e) { alert(e.message); }
  };
  const handleDeleteProd = async (id) => {
    if(window.confirm("¿Eliminar?")) { try { await deleteProduct(id); cargarDatos(); } catch(e){alert("Error al eliminar");} }
  };

  // --- LÓGICA USUARIOS ---
  const handleSaveUser = async () => {
    try {
      if (editingUser && editingUser.id) {
        await updateUser(editingUser.id, editingUser); // Editar
      } else {
        await createUser(editingUser); // Crear nuevo
      }
      setShowModalUser(false);
      cargarDatos();
      alert("Usuario guardado.");
    } catch (e) { alert(e.message); }
  };
  const handleDeleteUser = async (id) => {
    if(window.confirm("¿Eliminar usuario?")) { try { await deleteUser(id); cargarDatos(); } catch(e){alert(e.message);} }
  };

  // --- LÓGICA CATEGORÍAS ---
  const handleSaveCat = async () => {
    try {
      if (editingCat && editingCat.id) {
        await updateCategory(editingCat);
      } else {
        await createCategory(editingCat);
      }
      setShowModalCat(false);
      cargarDatos();
    } catch (e) { alert("Error al guardar categoría"); }
  };
  const handleDeleteCat = async (id) => {
    if(window.confirm("¿Eliminar categoría?")) { try { await deleteCategory(id); cargarDatos(); } catch(e){alert("No se puede eliminar (en uso).");} }
  };

  return (
    <section className="container">
      {/* HEADER */}
      <div style={{marginBottom:'30px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h1 style={{fontFamily:'"Playfair Display", serif', fontSize:'2.5rem', margin:0, color:'#333'}}>Panel de Gestión</h1>
          <p className="text-muted">Bienvenido, {role === 'admin' ? 'Administrador' : 'Vendedor'}</p>
        </div>
        <button className="btn-outline" onClick={cargarDatos}>↻ Actualizar</button>
      </div>

      {/* STATS CARDS */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', marginBottom:'30px'}}>
        <div className="panel" style={{padding:'20px', textAlign:'center', borderLeft:'5px solid #2E8B57'}}>
           <h3 style={{margin:0, fontSize:'2rem', color:'#2E8B57'}}>{ventas.length}</h3><p className="text-muted">Ventas</p>
        </div>
        <div className="panel" style={{padding:'20px', textAlign:'center', borderLeft:'5px solid #1976D2'}}>
           <h3 style={{margin:0, fontSize:'2rem', color:'#1976D2'}}>${totalVentas.toLocaleString("es-CL")}</h3><p className="text-muted">Ingresos</p>
        </div>
        <div className="panel" style={{padding:'20px', textAlign:'center', borderLeft:'5px solid #FFA000'}}>
           <h3 style={{margin:0, fontSize:'2rem', color:'#FFA000'}}>{productos.length}</h3><p className="text-muted">Productos</p>
        </div>
        {role === 'admin' && (
          <div className="panel" style={{padding:'20px', textAlign:'center', borderLeft:'5px solid #d32f2f'}}>
             <h3 style={{margin:0, fontSize:'2rem', color:'#d32f2f'}}>{usuarios.length}</h3><p className="text-muted">Usuarios</p>
          </div>
        )}
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div style={{borderBottom:'2px solid #eee', marginBottom:'20px', display:'flex', gap:'15px', overflowX:'auto'}}>
         {['productos', 'ventas', 'usuarios', 'categorias'].map(t => {
            if (role !== 'admin' && (t === 'usuarios' || t === 'categorias')) return null; // Vendedor no ve esto
            return (
              <button key={t} onClick={()=>setTab(t)} style={{
                padding:'10px 20px', background:'none', border:'none', 
                borderBottom: tab===t?'3px solid #2E8B57':'3px solid transparent', 
                fontWeight:'bold', fontSize:'1.1rem', cursor:'pointer', 
                color: tab===t?'#2E8B57':'#666', textTransform:'capitalize'
              }}>
                {t}
              </button>
            )
         })}
      </div>

      {/* --- TABLA PRODUCTOS --- */}
      {tab === 'productos' && (
        <div className="panel">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
            <h3>Inventario</h3>
            {role === 'admin' && <button className="btn" style={{background:'#2E8B57'}} onClick={()=>{setEditingProd(null); setShowModalProd(true)}}>+ Nuevo Producto</button>}
          </div>
          <table className="table">
            <thead><tr><th>Img</th><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th>{role==='admin'&&<th>Acciones</th>}</tr></thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.codigo}>
                  <td><img src={p.imagen||"/img/logo.jpg"} style={{width:32, height:32, borderRadius:4, objectFit:'cover'}}/></td>
                  <td>{p.codigo}</td><td>{p.nombre}</td><td>${p.precio.toLocaleString("es-CL")}</td>
                  <td><span style={{padding:'2px 8px', borderRadius:'10px', background:p.stock<10?'#ffebee':'#e8f5e9', color:p.stock<10?'#c62828':'#2e7d32', fontWeight:'bold', fontSize:'0.8rem'}}>{p.stock}</span></td>
                  {role==='admin'&&<td>
                    <button className="btn-outline" style={{padding:'4px 8px', marginRight:5}} onClick={()=>{setEditingProd(p); setShowModalProd(true)}}>✏️</button>
                    <button className="btn-outline" style={{padding:'4px 8px', color:'#d32f2f', borderColor:'#d32f2f'}} onClick={()=>handleDeleteProd(p.codigo)}>🗑️</button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TABLA VENTAS --- */}
      {tab === 'ventas' && (
        <div className="panel">
          <h3>Historial de Ventas</h3>
          <table className="table">
            <thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id}>
                  <td><b>#{v.folio}</b></td>
                  <td>{new Date(v.fecha).toLocaleDateString()}</td>
                  <td>{v.usuario?.nombre}</td>
                  <td>${v.total.toLocaleString("es-CL")}</td>
                  <td><span style={{padding:'2px 8px', borderRadius:'10px', background:v.estado==='pagada'?'#e8f5e9':'#ffebee', color:v.estado==='pagada'?'#2e7d32':'#c62828', fontWeight:'bold', fontSize:'0.8rem'}}>{v.estado}</span></td>
                  <td><Link to={`/orden/${v.id}`} className="btn-outline" style={{padding:'4px 10px', fontSize:'0.9rem'}}>Ver</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TABLA USUARIOS --- */}
      {tab === 'usuarios' && role === 'admin' && (
        <div className="panel">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
            <h3>Gestión de Usuarios</h3>
            {/* BOTÓN NUEVO USUARIO */}
            <button className="btn" style={{background:'#2E8B57'}} onClick={()=>{
              setEditingUser({ nombre:'', email:'', password:'', rol:'cliente' }); // Inicializamos vacío
              setShowModalUser(true);
            }}>+ Nuevo Usuario</button>
          </div>
          <table className="table">
            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td>
                  <td><span style={{padding:'4px 10px', borderRadius:'12px', fontWeight:'bold', fontSize:'0.8rem', background:'#f5f5f5'}}>{u.rol}</span></td>
                  <td>
                    <button className="btn-outline" style={{padding:'4px 8px', marginRight:5}} onClick={()=>{setEditingUser(u); setShowModalUser(true)}}>Editar</button>
                    <button className="btn-outline" style={{padding:'4px 8px', color:'#d32f2f', borderColor:'#d32f2f'}} onClick={()=>handleDeleteUser(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TABLA CATEGORÍAS (NUEVA) --- */}
      {tab === 'categorias' && role === 'admin' && (
        <div className="panel">
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
            <h3>Gestión de Categorías</h3>
            <button className="btn" style={{background:'#2E8B57'}} onClick={()=>{setEditingCat({ nombre:'' }); setShowModalCat(true)}}>+ Nueva Categoría</button>
          </div>
          <table className="table">
            <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id}>
                  <td style={{width:'80px'}}>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td style={{width:'150px'}}>
                    <button className="btn-outline" style={{padding:'4px 8px', marginRight:5}} onClick={()=>{setEditingCat(c); setShowModalCat(true)}}>Editar</button>
                    <button className="btn-outline" style={{padding:'4px 8px', color:'#d32f2f', borderColor:'#d32f2f'}} onClick={()=>handleDeleteCat(c.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODALES --- */}

      {/* Modal Producto */}
      {showModalProd && (
        <AdminForm producto={editingProd} onSave={handleSaveProduct} onClose={() => setShowModalProd(false)} />
      )}

      {/* Modal Usuario */}
      {showModalUser && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth:'500px'}}>
            <h2 style={{fontFamily:'"Playfair Display", serif'}}>{editingUser.id ? "Editar Usuario" : "Crear Usuario"}</h2>
            <div style={{display:'grid', gap:'15px', margin:'20px 0'}}>
              <div>
                <label className="lbl">Nombre</label>
                <input className="input" value={editingUser.nombre} onChange={e=>setEditingUser({...editingUser, nombre:e.target.value})} />
              </div>
              <div>
                <label className="lbl">Correo</label>
                <input className="input" value={editingUser.email} onChange={e=>setEditingUser({...editingUser, email:e.target.value})} />
              </div>
              {/* Solo mostramos contraseña al crear */}
              {!editingUser.id && (
                <div>
                  <label className="lbl">Contraseña</label>
                  <input className="input" type="password" value={editingUser.password} onChange={e=>setEditingUser({...editingUser, password:e.target.value})} />
                </div>
              )}
              <div>
                <label className="lbl">Rol</label>
                <select className="input" value={editingUser.rol} onChange={e=>setEditingUser({...editingUser, rol:e.target.value})}>
                  <option value="cliente">Cliente</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
              <button className="btn-outline" onClick={()=>setShowModalUser(false)}>Cancelar</button>
              <button className="btn" style={{background:'#2E8B57'}} onClick={handleSaveUser}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {showModalCat && editingCat && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth:'400px'}}>
            <h2 style={{fontFamily:'"Playfair Display", serif'}}>{editingCat.id ? "Editar Categoría" : "Nueva Categoría"}</h2>
            <div style={{margin:'20px 0'}}>
              <label className="lbl">Nombre de la Categoría</label>
              <input className="input" value={editingCat.nombre} onChange={e=>setEditingCat({...editingCat, nombre:e.target.value})} />
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
              <button className="btn-outline" onClick={()=>setShowModalCat(false)}>Cancelar</button>
              <button className="btn" style={{background:'#2E8B57'}} onClick={handleSaveCat}>Guardar</button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}