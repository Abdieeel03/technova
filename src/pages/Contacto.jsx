import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "../css_components/Contacto.module.css";

const initialForm = {
  nombre: "",
  email: "",
  mensaje: "",
};

export default function Contacto() {
  const [formData, setFormData] = useState(initialForm);
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setToast(null);
    }, 4200);

    return () => clearTimeout(timeoutId);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    // Private Keys obtenidas desde las variables de entorno de Vite
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      title: "Nuevo mensaje de contacto",
      from_name: formData.nombre,
      from_email: formData.email,
      time: new Date().toLocaleString(),
      message: formData.mensaje,
    };

    setIsSending(true);
    setToast(null);

    emailjs
      .send(serviceId, templateId, templateParams, {
        publicKey: publicKey,
      })
      .then(
        () => {
          setFormData(initialForm);
          setToast({
            type: "success",
            title: "Mensaje enviado",
            message: "Gracias por contactarnos. Te responderemos lo antes posible.",
          });
        },
        (error) => {
          setToast({
            type: "error",
            title: "No se pudo enviar",
            message: error?.text || "Inténtalo nuevamente en unos minutos.",
          });
        },
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <main className={styles.contactoMain}>
      {toast && (
        <div
          className={`${styles.toast} ${styles[toast.type]}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
        >
          <span className={styles.toastIcon} aria-hidden="true">
            {toast.type === "error" ? "!" : "✓"}
          </span>
          <div className={styles.toastContent}>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
          <button
            type="button"
            className={styles.toastClose}
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
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

          <button type="submit" disabled={isSending}>
            {isSending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </section>
    </main>
  );
}
