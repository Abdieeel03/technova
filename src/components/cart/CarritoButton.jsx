import styles from "../../css_components/CarritoButton.module.css";
import { useLanguage } from "../../context/LanguageContext";

export default function CarritoButton({ totalItems, onClick }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-controls="modal-carrito"
    >
      <span className={styles.icon} aria-hidden="true">
        🛒
      </span>
      <span className={styles.label}>{t.carritoBtn.label}</span>
      {totalItems > 0 ? (
        <span
          className={styles.badge}
          aria-label={t.carritoBtn.ariaItems.replace("{n}", totalItems)}
        >
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
