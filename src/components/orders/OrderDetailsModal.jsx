import OrderMap from "./OrderMap";
import styles from "../../css_components/OrderDetailsModal.module.css";

const formatCurrency = (value) => `S/. ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const getShippingLabel = (metodo) => {
  if (metodo === "pickup") return "Recojo en tienda";
  if (metodo === "standard") return "Envío a domicilio";
  return metodo || "Sin envío";
};

const getPaymentLabel = (pago) => {
  if (!pago) return "Pago directo";
  if (pago.ultimos4) {
    return `Tarjeta terminada en ${pago.ultimos4}`;
  }
  if (pago.metodo) return pago.metodo;
  return "Pago directo";
};

const formatDireccion = (direccion) => {
  if (!direccion) return null;
  const partes = [
    direccion.direccion,
    direccion.distrito,
    direccion.zona === "provincia" ? direccion.ciudad : null,
  ].filter(Boolean);
  return partes.join(", ");
};

export default function OrderDetailsModal({ orden, onClose }) {
  if (!orden) return null;

  const items = orden.items || [];
  const envio = orden.envio || {};
  const direccion = envio.direccion || null;
  const pago = orden.pago || null;
  const shippingCost = Number(envio.costoEnvio || 0);
  const subtotal = Number(orden.subtotal || 0);

  const computedSubtotal = items.reduce(
    (acc, item) =>
      acc + Number(item.precioUnitario || 0) * Number(item.cantidad || 0),
    0,
  );

  const finalSubtotal = subtotal > 0 ? subtotal : computedSubtotal;
  const total = Number(orden.total || finalSubtotal + shippingCost);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Pedido {orden.id?.slice(0, 8).toUpperCase()}
            </h2>
            <p className={styles.subtitle}>
              {formatDate(orden.createdAt)}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Cliente</h3>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>ID Usuario</span>
              <span className={styles.kvValue}>{orden.userId || "-"}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Estado</span>
              <span className={styles.kvValue}>
                {orden.status || "pendiente"}
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Productos ({items.length})
            </h3>
            <ul className={styles.itemsList}>
              {items.map((item, index) => (
                <li
                  key={`${orden.id}-${item.id || index}`}
                  className={styles.item}
                >
                  {item.imagen ? (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className={styles.itemThumb}
                    />
                  ) : (
                    <div className={styles.itemThumbPlaceholder}>📦</div>
                  )}
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.nombre}</p>
                    {(item.marca || item.categoria) && (
                      <p className={styles.itemSpecs}>
                        {[item.marca, item.categoria]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className={styles.itemPriceCol}>
                    <span className={styles.itemLineTotal}>
                      {formatCurrency(
                        Number(item.precioUnitario || 0) *
                          Number(item.cantidad || 0),
                      )}
                    </span>
                    {item.cantidad > 1 ? (
                      <span className={styles.itemQty}>
                        {item.cantidad} × {formatCurrency(item.precioUnitario)}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Envío</h3>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Método</span>
              <span className={styles.kvValue}>
                {getShippingLabel(envio.metodo)}
              </span>
            </div>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Costo</span>
              <span className={styles.kvValue}>
                {shippingCost > 0 ? formatCurrency(shippingCost) : "Gratis"}
              </span>
            </div>

            {envio.metodo === "standard" && direccion ? (
              <>
                <div className={styles.kv}>
                  <span className={styles.kvLabel}>Recibe</span>
                  <span className={styles.kvValue}>
                    {direccion.nombreReceptor || "-"}
                  </span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.kvLabel}>Teléfono</span>
                  <span className={styles.kvValue}>
                    {direccion.telefono || "-"}
                  </span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.kvLabel}>Dirección</span>
                  <span className={styles.kvValue}>
                    {formatDireccion(direccion) || "-"}
                  </span>
                </div>
                {direccion.referencia ? (
                  <div className={styles.kv}>
                    <span className={styles.kvLabel}>Referencia</span>
                    <span className={styles.kvValue}>
                      {direccion.referencia}
                    </span>
                  </div>
                ) : null}
                <OrderMap
                  latitud={direccion.latitud}
                  longitud={direccion.longitud}
                />
              </>
            ) : null}

            {envio.metodo === "pickup" ? (
              <p className={styles.note}>Av. Larco 345, Miraflores, Lima</p>
            ) : null}
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Pago</h3>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Método</span>
              <span className={styles.kvValue}>{getPaymentLabel(pago)}</span>
            </div>
            {pago?.titular ? (
              <div className={styles.kv}>
                <span className={styles.kvLabel}>Titular</span>
                <span className={styles.kvValue}>{pago.titular}</span>
              </div>
            ) : null}
            {pago?.pagadoEn ? (
              <div className={styles.kv}>
                <span className={styles.kvLabel}>Pagado el</span>
                <span className={styles.kvValue}>
                  {formatDate(pago.pagadoEn)}
                </span>
              </div>
            ) : null}
            {pago?.transaccionId ? (
              <div className={styles.kv}>
                <span className={styles.kvLabel}>ID Transacción</span>
                <span className={styles.kvValue}>{pago.transaccionId}</span>
              </div>
            ) : null}
          </section>

          <section className={styles.totalsSection}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(finalSubtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Envío</span>
              <span>
                {shippingCost > 0 ? formatCurrency(shippingCost) : "Gratis"}
              </span>
            </div>
            <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
