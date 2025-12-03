import React from "react";

const SEDES = [
  {
    id: "scl",
    nombre: "HuertoHogar — Santiago Centro",
    direccion: "Santiago Centro, RM",
    horario: "Lun–Vie: 09:00–19:00 · Sáb: 09:00–14:00",
    tags: ["Retiro en tienda", "Despacho RM", "Pago débito/crédito"],
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13320.882563756389!2d-70.653!3d-33.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59bc0f6d6a1%3A0x4f5fcd2c3d9e7b5f!2sSantiago%20de%20Chile!5e0!3m2!1ses!2scl!4v1699999999999"
  },
  {
    id: "prv",
    nombre: "HuertoHogar — Providencia",
    direccion: "Av. Providencia 1234, Providencia, RM",
    horario: "Lun–Vie: 09:00–19:00 · Sáb: 09:00–14:00",
    tags: ["Retiro en tienda", "Estación Metro cercana"],
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.8505!2d-70.61!3d-33.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59bc0f6d6a1%3A0x4f5fcd2c3d9e7b5f!2sProvidencia!5e0!3m2!1ses!2scl!4v1699999999999"
  },
  {
    id: "mpu",
    nombre: "HuertoHogar — Maipú",
    direccion: "Pajaritos 2000, Maipú, RM",
    horario: "Lun–Vie: 09:00–19:00 · Sáb: 09:00–14:00",
    tags: ["Retiro en tienda", "Estacionamiento"],
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.8505!2d-70.76!3d-33.49!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662da33a1c0fcd9%3A0x1!2sMaip%C3%BA!5e0!3m2!1ses!2scl!4v1699999999999"
  },
  {
    id: "vna",
    nombre: "HuertoHogar — Viña del Mar",
    direccion: "Av. Libertad 500, Viña del Mar",
    horario: "Lun–Vie: 09:00–19:00 · Sáb: 09:00–14:00",
    tags: ["Retiro en tienda", "Cobertura local"],
    iframeSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.8505!2d-71.55!3d-33.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689e12b3e8f5a5d%3A0x1!2sVi%C3%B1a%20del%20Mar!5e0!3m2!1ses!2scl!4v1699999999999"
  }
];

export default function Nosotros(){
  return (
    <main className="container about">
      <h1>Sobre nosotros</h1>

      {/* Historia */}
      <section className="panel">
        <h2>Nuestra historia</h2>
        <p>
          HuertoHogar nació con un objetivo simple:<b> frutas, verduras y lácteos </b> 
           de calidad a las familias, priorizando <b>frescura</b>, <b>origen local</b> y
          <b> precios justos</b>. Partimos como un emprendimiento familiar y hoy
          trabajamos con productores que comparten nuestros valores.
        </p>
      </section>

      {/* Misión / Visión */}
      <section className="about-cards">
        <article className="card about-card">
          <div className="body">
            <h3>Misión</h3>
            <p>
              Entregar productos frescos y saludables con experiencia simple:
              vitrina clara, compra rápida y atención cercana.
            </p>
          </div>
        </article>
        <article className="card about-card">
          <div className="body">
            <h3>Visión</h3>
            <p>
              Ser la tienda de confianza para el abastecimiento semanal,
              promoviendo hábitos sanos y sustentables.
            </p>
          </div>
        </article>
      </section>

      {/* Valores */}
      <section className="panel">
        <h2>Nuestros valores</h2>
        <ul>
          <li><b>Frescura:</b> Rotación constante y control de stock.</li>
          <li><b>Cercanía:</b> Comunicación clara y soporte amable.</li>
          <li><b>Transparencia:</b> Precios visibles y descripciones honestas.</li>
          <li><b>Sustentabilidad:</b> Preferencia por productores locales.</li>
        </ul>
      </section>

      {/* Sedes */}
      <h2>Nuestras sedes</h2>
      <section className="sedes-list">
        {SEDES.map(s => (
          <article className="card sede-row" key={s.id}>
            <div className="sede-info">
              <h3>{s.nombre}</h3>
              <p>📍 {s.direccion}</p>
              <p>🕒 {s.horario}</p>
              <div className="chips">
                {s.tags?.map(t => (<span key={t} className="chip">{t}</span>))}
              </div>
            </div>
            <div className="sede-map">
              <iframe
                title={`Mapa ${s.nombre}`}
                src={s.iframeSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </article>
        ))}
      </section>

      {/* Contacto */}
      <section className="panel">
        <h2>Contáctanos</h2>
        <p>
          ¿Dudas con tu pedido o cobertura? Escríbenos desde la página
          <a className="link" href="/contacto"> Contacto</a> y te respondemos a la brevedad.
        </p>
      </section>
    </main>
  );
}
