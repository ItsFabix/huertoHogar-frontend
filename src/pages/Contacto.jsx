import { useEffect, useState } from "react";
import { EMAIL_ALLOWED, required, maxLen } from "../utils/validators";

export default function Contacto(){
  const [form, setForm] = useState({ nombre: "", correo: "", comentario: "" });
  const [err, setErr] = useState({});
  const [ok, setOk] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validar = () => {
    const e = {};
    if (!required(form.nombre) || !maxLen(form.nombre, 100)) e.nombre = "Nombre requerido (máx 100).";
    if (!required(form.correo) || !EMAIL_ALLOWED.test(form.correo) || !maxLen(form.correo, 100)) e.correo = "Correo inválido o no permitido.";
    if (!required(form.comentario) || !maxLen(form.comentario, 500)) e.comentario = "Comentario requerido (máx 500).";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setOk("");
    if (!validar()) return;
    // Envío simulado
    setOk("Mensaje enviado. Te responderemos pronto.");
    setForm({ nombre: "", correo: "", comentario: "" });
    setErr({});
  };

  return (
    <section className="container">
      <h1>Contacto</h1>
      {ok && <div className="alert success">{ok}</div>}

      <form className="panel form" onSubmit={onSubmit} noValidate>
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={onChange} />
          <small className="error">{err.nombre || ""}</small>
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={form.correo} onChange={onChange} />
          <small className="error">{err.correo || ""}</small>
        </label>
        <label>
          Comentario
          <textarea name="comentario" rows={4} value={form.comentario} onChange={onChange} />
          <small className="error">{err.comentario || ""}</small>
        </label>
        <div className="actions">
          <button className="btn" type="submit">Enviar</button>
        </div>
      </form>
    </section>
  );
}
