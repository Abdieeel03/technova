import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../css_components/MisCompras.module.css";
import useAuth from "../auth/hooks/useAuth";
import { getOrdersByUser } from "../services/ordersStorage";
import { useLanguage } from "../context/LanguageContext";
import OrderMap from "../components/orders/OrderMap";

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return `S/. ${numeric.toFixed(2)}`;
};

const getMetodoLabel = (t, metodo) => {
  if (metodo === "pickup") return t.misCompras.metodoRecojo;
  if (metodo === "standard") return t.misCompras.metodoEstandar;
  return metodo;
};

const getStatusConfig = (t, status) => {
  const STATUS_CONFIG = {
    pagado: { label: t.misCompras.estadoPagado, tone: "success" },
    entregado: { label: t.misCompras.estadoEntregado, tone: "success" },
    enviado: { label: t.misCompras.estadoEnviado, tone: "info" },
    pendiente: { label: t.misCompras.estadoPendiente, tone: "warning" },
    cancelado: { label: t.misCompras.estadoCancelado, tone: "danger" },
    rechazado: { label: t.misCompras.estadoRechazado, tone: "danger" },
  };

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

const getPaymentLabel = (t, pago) => {
  if (!pago) {
    return t.misCompras.pagoDirecto;
  }

  if (pago.ultimos4) {
    return t.misCompras.tarjetaTerminacion.replace("{n}", pago.ultimos4);
  }

  return t.misCompras.pagoDirecto;
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
  const { t } = useLanguage();
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
          <h1>{t.misCompras.titulo}</h1>
          <p>
            {t.misCompras.subtitulo}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{t.misCompras.totalGastado}</span>
          <strong className={styles.summaryValue}>
            {formatCurrency(totalCompras)}
          </strong>
        </div>
      </section>

      {orders === null ? (
        <section className={styles.loading} aria-live="polite" aria-busy="true">
          <div className={styles.spinner} />
          <div>
            <h2>{t.misCompras.cargandoTitulo}</h2>
            <p>{t.misCompras.cargandoDesc}</p>
          </div>
        </section>
      ) : orders.length === 0 ? (
        <section className={styles.empty}>
          <div className={styles.emptyIcon}>🧾</div>
          <h2>{t.misCompras.sinCompras}</h2>
          <p>
            {t.misCompras.sinComprasDesc}
          </p>
          <Link to="/productos" className={styles.cta}>
            {t.misCompras.verProductos}
          </Link>
        </section>
      ) : (
        <section className={styles.list}>
          {orders.map((order) => {
            const statusConfig = getStatusConfig(t, order.status);
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
                    <span>{t.common.subtotal}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {hasShipping ? (
                    <div className={styles.breakdownRow}>
                      <span>{t.common.envio}</span>
                      <span>
                        {shippingCost > 0
                          ? formatCurrency(shippingCost)
                          : t.common.gratis}
                      </span>
                    </div>
                  ) : null}
                  <div
                    className={`${styles.breakdownRow} ${styles.breakdownTotal}`}
                  >
                    <span>{t.common.total}</span>
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
                    {t.misCompras.pedido}{getShortOrderId(order.id)} ·{" "}
                    {getPaymentLabel(t, order.pago)} ·{" "}
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
                        {t.misCompras.numeroPedido}
                      </span>
                      <span className={styles.detailValue}>{order.id}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>{t.misCompras.metodoPago}</span>
                      <span className={styles.detailValue}>
                        {getPaymentLabel(t, order.pago)}
                      </span>
                    </div>
                    {order.pago?.pagadoEn ? (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>{t.misCompras.pagadoEl}</span>
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
                              {getMetodoLabel(t, order.envio.metodo)}
                            </p>
                            {order.envio.metodo === "pickup" ? (
                              <p className={styles.shippingAddress}>
                                {t.misCompras.direccionTienda}
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
                            : t.misCompras.envioGratis}
                        </span>
                        {order.envio.metodo === "standard" &&
                        order.envio.direccion ? (
                          <OrderMap
                            latitud={order.envio.direccion.latitud}
                            longitud={order.envio.direccion.longitud}
                          />
                        ) : null}
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
