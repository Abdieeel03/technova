import { Link } from "react-router";
import styles from "../css_components/InfoPage.module.css";

export default function InfoPage({
  title,
  description,
  ctaLabel = "Volver al inicio",
  ctaTo = "/",
}) {
  return (
    <section className={styles.wrapper} aria-labelledby="info-page-title">
      <div className={styles.card}>
        <h2 id="info-page-title">{title}</h2>
        <p>{description}</p>
        <Link to={ctaTo} className={styles.cta} aria-label={ctaLabel}>
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
