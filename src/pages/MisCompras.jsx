import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import styles from "../css_components/MisCompras.module.css";
import useAuth from "../auth/hooks/useAuth";
import { getOrdersByUser } from "../services/ordersStorage";

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

export default function MisCompras() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    getOrdersByUser(user.id)
      .then((userOrders) => {
        if (isMounted) {
          setOrders(userOrders);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrders([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const totalCompras = useMemo(
    () => (orders || []).reduce((acc, order) => acc + Number(order.total || 0), 0),
    [orders],
  );

  if (!user) {
    return <Navigate to="/?modal=login" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>Mis compras</h1>
          <p>
            Revisa tu historial y el detalle de cada orden registrada en
            TechNova.
          </p>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total gastado</span>
          <strong className={styles.summaryValue}>
            {formatCurrency(totalCompras)}
          </strong>
        </div>
      </section>

      {orders === null ? (
        <section className={styles.loading} aria-live="polite" aria-busy="true">
          <div className={styles.spinner} />
          <div>
            <h2>Cargando tus compras...</h2>
            <p>Estamos consultando tu historial actualizado.</p>
          </div>
        </section>
      ) : orders.length === 0 ? (
        <section className={styles.empty}>
          <div className={styles.emptyIcon}>🧾</div>
          <h2>Aun no tienes compras</h2>
          <p>
            Cuando completes una compra, aparecera aqui con todos los detalles.
          </p>
          <Link to="/productos" className={styles.cta}>
            Ver productos
          </Link>
        </section>
      ) : (
        <section className={styles.list}>
          {orders.map((order) => (
            <article key={order.id} className={styles.card}>
              <header className={styles.cardHeader}>
                <div>
                  <p className={styles.orderLabel}>Orden #{order.id}</p>
                  <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
                </div>
                <div className={styles.orderTotal}>
                  {formatCurrency(order.total)}
                </div>
              </header>

              <div className={styles.items}>
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.id}`} className={styles.item}>
                    <div className={styles.thumb}>
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    <div className={styles.itemInfo}>
                      <h3>{item.nombre}</h3>
                      <p>{item.marca}</p>
                    </div>
                    <div className={styles.itemMeta}>
                      <span>{formatCurrency(item.precioUnitario)}</span>
                      <span>x{item.cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
