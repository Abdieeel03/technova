import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "../css_components/CheckoutExito.module.css";
import useAuth from "../auth/hooks/useAuth";
import { obtenerOrden } from "../services/checkoutApi";

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return `S/. ${numeric.toFixed(2)}`;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

export default function CheckoutExito() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !user?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    obtenerOrden(orderId, user.id)
      .then((data) => {
        if (isMounted) {
          setOrden(data);
        }
      })
      .catch(() => {
        // ignore
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderId, user?.id]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <p>Cargando tu orden...</p>
        </div>
      </main>
    );
  }

  if (!orden) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <span className={styles.iconError}>❌</span>
          </div>
          <h1>Orden no encontrada</h1>
          <p>No pudimos encontrar los detalles de esta orden.</p>
          <Link to="/productos" className={styles.ctaPrimary}>
            Ver productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.checkmark}>✓</span>
        </div>

        <h1>¡Pago exitoso!</h1>
        <p className={styles.subtitle}>
          Tu orden ha sido registrada correctamente
        </p>

        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Numero de orden</span>
            <span className={styles.infoValue}>{orden.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Fecha</span>
            <span className={styles.infoValue}>
              {formatDate(orden.createdAt)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Metodo de pago</span>
            <span className={styles.infoValue}>
              Tarjeta •••• {orden.pago?.ultimos4 || "****"}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Estado</span>
            <span className={`${styles.infoValue} ${styles.statusPaid}`}>
              Pagado
            </span>
          </div>
        </div>

        <div className={styles.itemsList}>
          <h3>Productos</h3>
          {orden.items.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.itemThumb}>
                <img src={item.imagen} alt={item.nombre} />
              </div>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.nombre}</p>
                <p className={styles.itemMeta}>
                  {formatCurrency(item.precioUnitario)} x{item.cantidad}
                </p>
              </div>
              <span className={styles.itemTotal}>
                {formatCurrency(item.precioUnitario * item.cantidad)}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span>Total pagado</span>
            <span className={styles.totalValue}>
              {formatCurrency(orden.total)}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/mis-compras" className={styles.ctaPrimary}>
            Ver mis compras
          </Link>
          <Link to="/productos" className={styles.ctaSecondary}>
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
