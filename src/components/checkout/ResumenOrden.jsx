import styles from "../../css_components/Checkout.module.css";
import { useLanguage } from "../../context/LanguageContext";

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return `S/. ${numeric.toFixed(2)}`;
};

export default function ResumenOrden({ items, subtotal, costoEnvio }) {
  const { t } = useLanguage();
  const total = subtotal + (costoEnvio || 0);

  return (
    <aside className={styles.resumen}>
      <h3 className={styles.resumenTitle}>{t.checkout.resumenTitulo}</h3>

      <div className={styles.resumenItems}>
        {items.map((item) => (
          <div key={item.id} className={styles.resumenItem}>
            <div className={styles.resumenThumb}>
              <img src={item.imagen} alt={item.nombre} />
              <span className={styles.resumenBadge}>{item.cantidad}</span>
            </div>
            <div className={styles.resumenInfo}>
              <p className={styles.resumenName}>{item.nombre}</p>
              <p className={styles.resumenMeta}>{item.marca}</p>
            </div>
            <span className={styles.resumenPrice}>
              {formatCurrency(item.precioUnitario * item.cantidad)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.resumenTotals}>
        <div className={styles.resumenRow}>
          <span>{t.common.subtotal}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.resumenRow}>
          <span>{t.common.envio}</span>
          <span>
            {costoEnvio > 0 ? formatCurrency(costoEnvio) : t.common.gratis}
          </span>
        </div>
        <div className={`${styles.resumenRow} ${styles.resumenTotal}`}>
          <span>{t.common.total}</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </aside>
  );
}
