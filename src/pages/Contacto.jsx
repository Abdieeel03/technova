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
  const [showToast, setShowToast] = useState(false);
  const { t } = useLanguage();

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

    emailjs.send(serviceId, templateId, templateParams, { publicKey }).then(
      () => {
        alert("SUCCESS!");
        setFormData(initialForm);
        setShowToast(true);
      },
      (error) => {
        alert("FAILED... " + error.text);
      },
    );
  };

  return (
    <main className={styles.contactoMain}>
      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {t.contacto.enviado}
        </div>
      )}

      <section className={styles.contactoHeader}>
        <h1>{t.contacto.titulo}</h1>
        <p>{t.contacto.subtitulo}</p>
      </section>

      <section className={styles.contactoGrid}>
        <article className={styles.infoCard}>
          <h2>{t.contacto.infoTitulo}</h2>
          <p>{t.contacto.infoDesc}</p>

          <ul className={styles.infoList}>
            <li>
              <strong>{t.contacto.correoLabel}</strong> contacto@technova.com
            </li>
            <li>
              <strong>{t.contacto.telefonoLabel}</strong> +57 300 000 0000
            </li>
            <li>
              <strong>{t.contacto.horarioLabel}</strong>{" "}
              {t.contacto.horarioValor}
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

          <button type="submit">{t.contacto.enviar}</button>
        </form>
      </section>
    </main>
  );
}
