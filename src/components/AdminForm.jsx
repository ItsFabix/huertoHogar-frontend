import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";

export default function AdminForm({ producto, onSave, onClose }) {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    imagen: "",
    descripcion: "",
    oferta: false,
    precioOferta: 0
  });

  const [listaCategorias, setListaCategorias] = useState([]);

  useEffect(() => {
    getCategories().then(cats => {
      if (cats.length === 0) {
        setListaCategorias([
          { id: 1, nombre: "Frutas Frescas" },
          { id: 2, nombre: "Verduras Orgánicas" },
          { id: 3, nombre: "Productos Lácteos" },
          { id: 4, nombre: "Productos Orgánicos" }
        ]);
      } else {
        setListaCategorias(cats);
      }
    });
  }, []);

  useEffect(() => {
    if (producto) {
      setForm({
        ...producto,
        oferta: producto.oferta || false,
        precioOferta: producto.precioOferta || 0
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- CORRECCIÓN AQUÍ ---
    // Si la casilla "oferta" no está marcada, forzamos que el precioOferta sea 0
    // Esto evita que se guarde un precio "fantasma" que active la oferta por error.
    const datosParaGuardar = {
      ...form,
      precioOferta: form.oferta ? form.precioOferta : 0
    };

    onSave(datosParaGuardar);
  };

  // Estilos (sin cambios)
  const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' },
    modal: { background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.3s ease' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    title: { margin: 0, fontSize: '1.5rem', color: '#333', fontFamily: '"Playfair Display", serif' },
    closeBtn: { background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#999', lineHeight: 0.5 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#555' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' },
    checkboxWrapper: { background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #eee' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{producto ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Código (ID)</label>
              <input style={styles.input} name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ej: FR005" disabled={!!producto} required />
            </div>
            <div>
              <label style={styles.label}>Categoría</label>
              <select style={styles.input} name="categoria" value={form.categoria} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {listaCategorias.map(cat => (
                  <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre del Producto</label>
            <input style={styles.input} name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>

          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Precio Normal ($)</label>
              <input type="number" style={styles.input} name="precio" value={form.precio} onChange={handleChange} required />
            </div>
            <div>
              <label style={styles.label}>Stock (Unidades)</label>
              <input type="number" style={styles.input} name="stock" value={form.stock} onChange={handleChange} required />
            </div>
          </div>

          {/* Fila 4: Imagen (Subir desde PC) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Imagen del Producto</label>

            {/* Input para subir archivo */}
            <input
              type="file"
              accept="image/*"
              style={{ ...styles.input, padding: '5px' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    // Guardamos la imagen convertida a texto en el estado
                    handleChange({ target: { name: 'imagen', value: reader.result } });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            {/* Input oculto para mantener la URL si se escribe manual (opcional) */}
            <input
              type="text"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="O pega una URL aquí..."
              style={{ marginTop: '5px', fontSize: '0.8rem', padding: '5px', width: '100%', border: '1px dashed #ccc' }}
            />

            {/* Vista previa */}
            {form.imagen && (
              <div style={{ marginTop: 10, textAlign: 'center', background: '#eee', padding: '10px', borderRadius: '8px' }}>
                <img src={form.imagen} alt="Vista previa" style={{ maxHeight: '150px', objectFit: 'contain' }} />
              </div>
            )}
          </div>
          <div style={styles.checkboxWrapper}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '600', color: '#333' }}>
              <input type="checkbox" name="oferta" checked={form.oferta} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              Activar Oferta
            </label>

            {form.oferta && (
              <div style={{ marginTop: '10px', paddingLeft: '28px' }}>
                <label style={{ ...styles.label, fontSize: '0.85rem' }}>Precio Oferta ($)</label>
                <input type="number" style={{ ...styles.input, width: '150px' }} name="precioOferta" value={form.precioOferta} onChange={handleChange} />
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Descripción</label>
            <textarea style={{ ...styles.input, minHeight: '80px', fontFamily: 'inherit' }} name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          <div style={styles.actions}>
            <button type="button" className="btn-outline" onClick={onClose} style={{ padding: '10px 20px' }}>Cancelar</button>
            <button type="submit" className="btn" style={{ background: '#2E8B57', padding: '10px 30px', fontSize: '1rem' }}>
              {producto ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}