import styles from "../../css_components/CarritoButton.module.css";

export default function CarritoButton({ totalItems, onClick }) {
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
      <span className={styles.label}>Carrito</span>
      {totalItems > 0 ? (
        <span className={styles.badge} aria-label={`${totalItems} items`}>
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
