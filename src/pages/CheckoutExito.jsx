import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "../css_components/CheckoutExito.module.css";
import useAuth from "../auth/hooks/useAuth";
import { obtenerOrden } from "../services/checkoutApi";
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId && user?.id));

  useEffect(() => {
    if (!orderId || !user?.id) {
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
          <p>{t.checkoutExito.cargandoOrden}</p>
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
          <h1>{t.checkoutExito.ordenNoEncontrada}</h1>
          <p>{t.checkoutExito.ordenNoEncontradaDesc}</p>
          <Link to="/productos" className={styles.ctaPrimary}>
            {t.misCompras.verProductos}
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

        <h1>{t.checkoutExito.pagoExitoso}</h1>
        <p className={styles.subtitle}>
          {t.checkoutExito.ordenRegistrada}
        </p>

        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>{t.checkoutExito.numeroOrden}</span>
            <span className={styles.infoValue}>{orden.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>{t.checkoutExito.fecha}</span>
            <span className={styles.infoValue}>
              {formatDate(orden.createdAt)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>{t.checkoutExito.metodoPago}</span>
            <span className={styles.infoValue}>
              {t.misCompras.tarjetaTerminacion.replace("{n}", orden.pago?.ultimos4 || "****")}
            </span>
          </div>
          {orden.envio?.metodo ? (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t.checkoutExito.envio}</span>
              <span className={styles.infoValue}>
                {orden.envio.metodo === "pickup"
                  ? t.checkoutExito.metodoRecojo
                  : t.checkoutExito.metodoEstandar}
              </span>
            </div>
          ) : null}
          {orden.envio?.metodo === "standard" && orden.envio?.direccion ? (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t.checkoutExito.direccion}</span>
              <span className={styles.infoValue}>
                {[
                  orden.envio.direccion.direccion,
                  orden.envio.direccion.distrito,
                  orden.envio.direccion.zona === "provincia"
                    ? orden.envio.direccion.ciudad
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          ) : null}
          {orden.envio?.metodo === "pickup" ? (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t.checkoutExito.puntoRecojo}</span>
              <span className={styles.infoValue}>
                {t.checkoutExito.direccionTienda}
              </span>
            </div>
          ) : null}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>{t.checkoutExito.estado}</span>
            <span className={`${styles.infoValue} ${styles.statusPaid}`}>
              {t.checkoutExito.pagado}
            </span>
          </div>
        </div>

        <div className={styles.itemsList}>
          <h3>{t.checkoutExito.productosTitulo}</h3>
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
          {orden.envio?.costoEnvio ? (
            <>
              <div className={styles.totalRowSecondary}>
                <span>{t.common.subtotal}</span>
                <span>{formatCurrency(orden.subtotal)}</span>
              </div>
              <div className={styles.totalRowSecondary}>
                <span>{t.checkoutExito.envio}</span>
                <span>{formatCurrency(orden.envio.costoEnvio)}</span>
              </div>
            </>
          ) : null}
          <div className={styles.totalRow}>
            <span>{t.checkoutExito.totalPagado}</span>
            <span className={styles.totalValue}>
              {formatCurrency(orden.total)}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/mis-compras" className={styles.ctaPrimary}>
            {t.checkoutExito.verMisCompras}
          </Link>
          <Link to="/productos" className={styles.ctaSecondary}>
            {t.checkoutExito.seguirComprando}
          </Link>
        </div>
      </div>
    </main>
  );
}
