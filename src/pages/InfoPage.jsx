import { Link } from "react-router";
import styles from "../css_components/InfoPage.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function InfoPage({
  title,
  description,
  ctaLabel,
  ctaTo = "/",
}) {
  const { t } = useLanguage();
  const resolvedCtaLabel = ctaLabel || t.terminos.volver;

  return (
    <section className={styles.wrapper} aria-labelledby="info-page-title">
      <div className={styles.card}>
        <h2 id="info-page-title">{title}</h2>
        <p>{description}</p>
        <Link to={ctaTo} className={styles.cta} aria-label={resolvedCtaLabel}>
          {resolvedCtaLabel}
        </Link>
      </div>
    </section>
  );
}
