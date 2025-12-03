import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService"; // Usamos el servicio que creamos antes
import { EMAIL_ALLOWED } from "../utils/validators";

// Funciones auxiliares para RUT (las mantenemos porque son útiles en el front)
function normalizaRut(s) {
  return (s || "").toString().replace(/[.\s-]/g, "").toUpperCase();
}
function dvRut(num) {
  let M = 0, S = 1;
  for (; num; num = Math.floor(num/10)) {
    S = (S + (num % 10) * (9 - (M++ % 6))) % 11;
  }
  return S ? String(S - 1) : "K";
}
function validaRut(rut) {
  const r = normalizaRut(rut);
  const m = r.match(/^(\d{7,8})([0-9K])$/i);
  if (!m) return false;
  const cuerpo = m[1], dv = m[2].toUpperCase();
  return dvRut(Number(cuerpo)) === dv;
}
function formatRut(rut){
  const r = normalizaRut(rut);
  const m = r.match(/^(\d{7,8})([0-9K])?$/i);
  if (!m) return rut;
  const cuerpo = m[1];
  const dv = dvRut(Number(cuerpo));
  const withDots = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots}-${dv}`;
}

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "", apellidos: "", correo: "", rut: "", pass: "", pass2: ""
  });
  const [err, setErr] = useState({});
  const nav = useNavigate();

  function set(k, v){ setForm(f => ({...f, [k]: v})); }
  function error(k, msg){ setErr(e => ({...e, [k]: msg})); }

  async function onSubmit(e){
    e.preventDefault(); 
    setErr({});
    let ok = true;

    // Validaciones locales
    if (!form.nombre || form.nombre.length > 50) { error("nombre","Nombre requerido."); ok=false; }
    if (!form.apellidos) { error("apellidos","Apellidos requeridos."); ok=false; }
    if (!form.correo || !EMAIL_ALLOWED.test(form.correo)) { error("correo","Correo inválido."); ok=false; }
    if (form.rut && !validaRut(form.rut)) { error("rut","RUT inválido."); ok=false; }
    if (!form.pass || form.pass.length < 4) { error("pass","Mínimo 4 caracteres."); ok=false; }
    if (form.pass !== form.pass2) { error("pass2","Contraseñas no coinciden."); ok=false; }

    if (!ok) return;

    // Preparar objeto para el Backend
    // El backend espera: { nombre, email, password, rut, rol }
    const usuarioParaBackend = {
      nombre: `${form.nombre} ${form.apellidos}`, // Unimos nombre y apellido
      email: form.correo,
      password: form.pass,
      rut: form.rut,
      rol: "cliente" // Forzamos que sea cliente
    };

    try {
      // Llamada al Backend
      await register(usuarioParaBackend);
      alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
      nav("/login"); // Redirigir al login
    } catch (errorMsg) {
      console.error(errorMsg);
      alert("Error al registrar: " + errorMsg);
    }
  }

  return (
    <section className="container">
      <h1 className="title">Registro (Backend)</h1>
      <form className="panel" onSubmit={onSubmit}>
        <div className="field">
          <label>Nombre</label>
          <input className="input" value={form.nombre} onChange={e=>set("nombre", e.target.value)}/>
          {err.nombre && <small className="error">{err.nombre}</small>}
        </div>
        <div className="field">
          <label>Apellidos</label>
          <input className="input" value={form.apellidos} onChange={e=>set("apellidos", e.target.value)}/>
          {err.apellidos && <small className="error">{err.apellidos}</small>}
        </div>
        <div className="field">
          <label>Correo</label>
          <input className="input" value={form.correo} onChange={e=>set("correo", e.target.value)}/>
          {err.correo && <small className="error">{err.correo}</small>}
        </div>
        <div className="field">
          <label>RUT (opcional)</label>
          <input
            className="input"
            placeholder="12.345.678-5"
            value={form.rut}
            onChange={e=>set("rut", e.target.value)}
            onBlur={e=> set("rut", formatRut(e.target.value))}
          />
          {err.rut && <small className="error">{err.rut}</small>}
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" className="input" value={form.pass} onChange={e=>set("pass", e.target.value)}/>
          {err.pass && <small className="error">{err.pass}</small>}
        </div>
        <div className="field">
          <label>Repetir contraseña</label>
          <input type="password" className="input" value={form.pass2} onChange={e=>set("pass2", e.target.value)}/>
          {err.pass2 && <small className="error">{err.pass2}</small>}
        </div>

        <div className="actions" style={{marginTop:10}}>
          <button className="btn">Crear cuenta</button>
        </div>
      </form>
    </section>
  );
}