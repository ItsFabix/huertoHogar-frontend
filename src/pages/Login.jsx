import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { setSession } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ correo: "", pass: "" });
  const [err, setErr] = useState({});
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validar = () => {
    const e = {};
    if (!form.correo) e.correo = "Correo requerido.";
    if (!form.pass) e.pass = "Contraseña requerida.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr({});
    
    if (!validar()) return;

    try {
      // 1. Llamamos al backend y recibimos el objeto completo
      const data = await login(form.correo, form.pass);
      
      // 2. Guardamos los datos REALES en la sesión
      setSession({ 
        token: data.token,
        nombre: data.nombre, 
        correo: data.email,
        rol: data.rol
      });
      
      // 3. Forzamos la actualización del Header para que muestre el nombre de inmediato
      window.dispatchEvent(new Event("session:changed"));
      
      alert(`¡Bienvenido, ${data.nombre}!`);
      nav("/"); 
      
    } catch (error) {
      console.error(error);
      setMsg("Error: Credenciales incorrectas o problema de servidor.");
    }
  };

  return (
    <section className="container">
      <h1>Iniciar sesión</h1>
      {msg && <div className="alert" style={{color:'red', borderColor:'red', marginBottom:'15px', padding:'10px', border:'1px solid red', borderRadius:'5px'}}>{msg}</div>}

      <form className="panel form" onSubmit={onSubmit} noValidate>
        <label>
          Correo
          <input name="correo" type="email" value={form.correo} onChange={onChange} className="input" />
          <small className="error" style={{color:'red'}}>{err.correo || ""}</small>
        </label>
        <label>
          Contraseña
          <input name="pass" type="password" value={form.pass} onChange={onChange} className="input" />
          <small className="error" style={{color:'red'}}>{err.pass || ""}</small>
        </label>
        <div className="actions" style={{marginTop:'20px'}}>
          <button className="btn" type="submit">Entrar</button>
          <Link className="btn-outline" to="/registro">Crear cuenta</Link>
        </div>
      </form>
    </section>
  );
}