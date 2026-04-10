import { useEffect, useState } from "react";
import styles from "../css_components/Contacto.module.css";

const initialForm = {
  nombre: "",
  email: "",
  mensaje: "",
};

export default function Contacto() {
  const [formData, setFormData] = useState(initialForm);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setShowToast(false);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [showToast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowToast(true);
    setFormData(initialForm);
  };

  return (
    <main className={styles.contactoMain}>
      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          Mensaje enviado
        </div>
      )}

      <section className={styles.contactoHeader}>
        <h1>Contáctanos</h1>
        <p>
          ¿Tienes dudas sobre nuestros productos? Escríbenos y te responderemos
          lo antes posible.
        </p>
      </section>

      <section className={styles.contactoGrid}>
        <article className={styles.infoCard}>
          <h2>Información de contacto</h2>
          <p>
            Estamos disponibles para ayudarte con compras, pedidos y soporte
            general.
          </p>

          <ul className={styles.infoList}>
            <li>
              <strong>Correo:</strong> contacto@technova.com
            </li>
            <li>
              <strong>Teléfono:</strong> +57 300 000 0000
            </li>
            <li>
              <strong>Horario:</strong> Lunes a Viernes, 8:00 a.m. - 6:00 p.m.
            </li>
          </ul>
        </article>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>Envíanos un mensaje</h2>

          <label className={styles.field}>
            Nombre
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.field}>
            Correo electrónico
            <input
              type="email"
              name="email"
              placeholder="tunombre@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.field}>
            Mensaje
            <textarea
              name="mensaje"
              rows="5"
              placeholder="Cuéntanos cómo podemos ayudarte"
              value={formData.mensaje}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Enviar mensaje</button>
        </form>
      </section>
    </main>
  );
}
