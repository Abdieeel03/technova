import { Link } from "react-router";
import styles from "../css_components/InfoPage.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className={styles.wrapper} aria-labelledby="not-found-title">
      <div className={styles.card}>
        <p className={styles.tag}>{t.notFound.tag}</p>
        <h2 id="not-found-title">{t.notFound.titulo}</h2>
        <p>{t.notFound.desc}</p>
        <Link
          to="/productos"
          className={styles.cta}
          aria-label={t.notFound.cta}
        >
          {t.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
