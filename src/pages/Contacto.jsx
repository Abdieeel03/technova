import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "../css_components/Contacto.module.css";
import { useLanguage } from "../context/LanguageContext";

const initialForm = {
  nombre: "",
  email: "",
  mensaje: "",
};

export default function Contacto() {
  const [formData, setFormData] = useState(initialForm);
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
useEffect(() => {

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
            title: t.contacto.enviado,
            message: t.contacto.enviadoMsg,
          });
        },
        (error) => {
          setToast({
            type: "error",
            title: t.contacto.errorTitulo,
            message: error?.text || t.contacto.errorMsg,
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
            aria-label={t.contacto.ariaCerrarNotif}
          >
            ×
          </button>
        </div>
      )}

      <section className={styles.contactoHeader}>
        <h1>{t.contacto.titulo}</h1>
        <p>
          {t.contacto.subtitulo}
        </p>
      </section>

      <section className={styles.contactoGrid}>
        <article className={styles.infoCard}>
          <h2>{t.contacto.infoTitulo}</h2>
          <p>
            {t.contacto.infoDesc}
          </p>

          <ul className={styles.infoList}>
            <li>
              <strong>{t.contacto.correoLabel}</strong> contacto@technova.com
            </li>
            <li>
              <strong>{t.contacto.telefonoLabel}</strong> +57 300 000 0000
            </li>
            <li>
              <strong>{t.contacto.horarioLabel}</strong> {t.contacto.horarioValor}
            </li>
          </ul>
        </article>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>{t.contacto.formTitulo}</h2>

          <label className={styles.field}>
            {t.contacto.nombre}
            <input
              type="text"
              name="nombre"
              placeholder={t.contacto.nombrePlaceholder}
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.field}>
            {t.contacto.correo}
            <input
              type="email"
              name="email"
              placeholder={t.contacto.correoPh}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.field}>
            {t.contacto.mensaje}
            <textarea
              name="mensaje"
              rows="5"
              placeholder={t.contacto.mensajePh}
              value={formData.mensaje}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={isSending}>
            {isSending ? t.contacto.enviando : t.contacto.enviar}
          </button>
        </form>
      </section>
    </main>
  );
}
