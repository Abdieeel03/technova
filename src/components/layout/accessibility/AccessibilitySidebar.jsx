import Perfiles from "./accessibilityWidgets/Perfiles";
import styles from "../../../css_components/accessibility/AccessibilitySidebar.module.css";

export default function AccessibilitySidebar({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-label="Menú de accesibilidad"
        aria-hidden={!isOpen}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span>Menú de accesibilidad</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Espacio para hacer los Idiomas y Perfiles */}
          {/* <Lenguague /> */}
          <Perfiles />
          {/* Componentes que se traigan se renderizan aqui */}
          <div className={styles.gridContainer}>{children}</div>
        </div>
      </aside>
    </>
  );
}
