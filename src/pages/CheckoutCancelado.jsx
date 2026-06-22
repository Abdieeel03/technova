import { Link } from "react-router-dom";
import styles from "../css_components/CheckoutCancelado.module.css";

export default function CheckoutCancelado() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.xmark}>✕</span>
        </div>

        <h1>Pago no completado</h1>
        <p className={styles.subtitle}>
          Tu pago no pudo ser procesado. No se ha realizado ningun cargo a tu
          tarjeta. Puedes intentarlo de nuevo o volver a revisar tu carrito.
        </p>

        <div className={styles.actions}>
          <Link to="/checkout" className={styles.ctaPrimary}>
            Intentar de nuevo
          </Link>
          <Link to="/productos" className={styles.ctaSecondary}>
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
