import { Link } from "react-router-dom";
import styles from "../css_components/CheckoutCancelado.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function CheckoutCancelado() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.xmark}>✕</span>
        </div>

        <h1>{t.checkoutCancelado.titulo}</h1>
        <p className={styles.subtitle}>
          {t.checkoutCancelado.desc}
        </p>

        <div className={styles.actions}>
          <Link to="/checkout" className={styles.ctaPrimary}>
            {t.checkoutCancelado.intentar}
          </Link>
          <Link to="/productos" className={styles.ctaSecondary}>
            {t.checkoutCancelado.seguirComprando}
          </Link>
        </div>
      </div>
    </main>
  );
}
