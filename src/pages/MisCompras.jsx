import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../css_components/MisCompras.module.css";
import useAuth from "../auth/hooks/useAuth";
import { getOrdersByUser } from "../services/ordersStorage";

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return `S/. ${numeric.toFixed(2)}`;
};

const METODO_LABELS = {
  standard: "Envio estandar",
  pickup: "Recojo en tienda",
};

const STATUS_CONFIG = {
  pagado: { label: "Pagado", tone: "success" },
  entregado: { label: "Entregado", tone: "success" },
  enviado: { label: "Enviado", tone: "info" },
  pendiente: { label: "Pendiente", tone: "warning" },
  cancelado: { label: "Cancelado", tone: "danger" },
  rechazado: { label: "Rechazado", tone: "danger" },
};

const getStatusConfig = (status) => {
  if (status && STATUS_CONFIG[status]) {
    return STATUS_CONFIG[status];
  }

  if (status) {
    return {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      tone: "neutral",
    };
  }

  return STATUS_CONFIG.pagado;
};

const getPaymentLabel = (pago) => {
  if (!pago) {
    return "Pago directo";
  }

  if (pago.ultimos4) {
    return `Tarjeta •••• ${pago.ultimos4}`;
  }

  return "Pago directo";
};

const formatDireccion = (direccion) => {
  if (!direccion) {
    return null;
  }

  const partes = [
    direccion.direccion,
    direccion.distrito,
    direccion.zona === "provincia" ? direccion.ciudad : null,
  ].filter(Boolean);

  return partes.join(", ");
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const formatDateShort = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getShortOrderId = (id) => {
  if (!id) {
    return "-------";
  }

  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
};

export default function MisCompras() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

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
    () =>
      (orders || []).reduce((acc, order) => acc + Number(order.total || 0), 0),
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
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const isExpanded = Boolean(expandedOrders[order.id]);
            const hasShipping = Boolean(order.envio?.metodo);
            const shippingCost = Number(order.envio?.costoEnvio || 0);
            const computedSubtotal = (order.items || []).reduce(
              (acc, item) =>
                acc +
                Number(item.precioUnitario || 0) * Number(item.cantidad || 0),
              0,
            );
            const subtotal = Number.isFinite(Number(order.subtotal))
              ? Number(order.subtotal)
              : computedSubtotal;
            const total = Number.isFinite(Number(order.total))
              ? Number(order.total)
              : subtotal + shippingCost;
            const detailId = `detalle-pedido-${order.id}`;

            return (
              <article key={order.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.orderDateTop}>
                    {formatDateShort(order.createdAt)}
                  </span>
                  <span
                    className={`${styles.statusBadge} ${styles[`tone-${statusConfig.tone}`]}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                <div className={styles.items}>
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className={styles.item}>
                      <div className={styles.thumb}>
                        <img src={item.imagen} alt={item.nombre} />
                      </div>
                      <div className={styles.itemInfo}>
                        <h3>{item.nombre}</h3>
                        {item.marca || item.categoria ? (
                          <p className={styles.itemSpecs}>
                            {[item.marca, item.categoria]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        ) : null}
                      </div>
                      <div className={styles.itemPrice}>
                        {item.descuento ? (
                          <div className={styles.itemPriceTop}>
                            <span className={styles.itemOriginal}>
                              {formatCurrency(item.precioOriginal)}
                            </span>
                            <span className={styles.itemDiscountTag}>
                              -{item.descuento}%
                            </span>
                          </div>
                        ) : null}
                        <span className={styles.itemLineTotal}>
                          {formatCurrency(
                            Number(item.precioUnitario || 0) *
                              Number(item.cantidad || 0),
                          )}
                        </span>
                        {item.cantidad > 1 ? (
                          <span className={styles.itemQty}>
                            {item.cantidad} ×{" "}
                            {formatCurrency(item.precioUnitario)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.divider} />

                <div className={styles.breakdown}>
                  <div className={styles.breakdownRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {hasShipping ? (
                    <div className={styles.breakdownRow}>
                      <span>Envio</span>
                      <span>
                        {shippingCost > 0
                          ? formatCurrency(shippingCost)
                          : "Gratis"}
                      </span>
                    </div>
                  ) : null}
                  <div
                    className={`${styles.breakdownRow} ${styles.breakdownTotal}`}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.detailsToggle}
                  onClick={() => toggleOrder(order.id)}
                  aria-expanded={isExpanded}
                  aria-controls={detailId}
                >
                  <span className={styles.detailsToggleText}>
                    Pedido #{getShortOrderId(order.id)} ·{" "}
                    {getPaymentLabel(order.pago)} ·{" "}
                    {formatDate(order.createdAt)}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`${styles.chevron} ${
                      isExpanded ? styles.chevronOpen : ""
                    }`}
                  />
                </button>

                {isExpanded ? (
                  <div id={detailId} className={styles.detailsPanel}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>
                        Numero de pedido
                      </span>
                      <span className={styles.detailValue}>{order.id}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Metodo de pago</span>
                      <span className={styles.detailValue}>
                        {getPaymentLabel(order.pago)}
                      </span>
                    </div>
                    {order.pago?.pagadoEn ? (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Pagado el</span>
                        <span className={styles.detailValue}>
                          {formatDate(order.pago.pagadoEn)}
                        </span>
                      </div>
                    ) : null}

                    {hasShipping ? (
                      <div className={styles.shippingBlock}>
                        <div className={styles.shippingInfo}>
                          <span className={styles.shippingIcon}>
                            {order.envio.metodo === "pickup" ? "🏬" : "📦"}
                          </span>
                          <div>
                            <p className={styles.shippingMethod}>
                              {METODO_LABELS[order.envio.metodo] ||
                                order.envio.metodo}
                            </p>
                            {order.envio.metodo === "pickup" ? (
                              <p className={styles.shippingAddress}>
                                Av. Larco 345, Miraflores, Lima
                              </p>
                            ) : formatDireccion(order.envio.direccion) ? (
                              <p className={styles.shippingAddress}>
                                {order.envio.direccion.nombreReceptor} ·{" "}
                                {formatDireccion(order.envio.direccion)}
                                {order.envio.direccion.telefono
                                  ? ` · ${order.envio.direccion.telefono}`
                                  : ""}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <span className={styles.shippingCost}>
                          {shippingCost > 0
                            ? formatCurrency(shippingCost)
                            : "Envio gratis"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
