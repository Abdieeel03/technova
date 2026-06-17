import Perfiles from "./accessibilityWidgets/Perfiles";
import Lenguague from "./accessibilityWidgets/Lenguague";
import styles from "../../../css_components/accessibility/AccessibilitySidebar.module.css";
import { useLanguage } from "../../../context/LanguageContext";

export default function AccessibilitySidebar({ isOpen, onClose, children }) {
  const { t } = useLanguage();

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-label={t.accesibilidad.titulo}
        aria-hidden={!isOpen}
        data-no-spacing="true"
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span>{t.accesibilidad.titulo}</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t.accesibilidad.cerrar}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <Lenguague />
          <Perfiles />
          <div className={styles.gridContainer}>{children}</div>
        </div>
      </aside>
    </>
  );
}
