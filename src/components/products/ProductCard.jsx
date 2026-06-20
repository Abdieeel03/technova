import { Link, useLocation } from "react-router-dom";
import styles from "../../css_components/ProductCard.module.css";

export default function ProductCard({ producto }) {
  const location = useLocation();
  const tieneOferta = producto.ofertaNavideña && producto.ofertaNavideña.activa;

  return (
    <Link
      to={`/productos/${producto.id}`}
      state={{ from: location.pathname + location.search }}
      className={styles.card}
    >
      {tieneOferta && (
        <span className={styles.badge}>{producto.ofertaNavideña.etiqueta}</span>
      )}

      <div className={styles.imageContainer}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.marca}>{producto.marca}</span>
        <p className={styles.nombre}>{producto.nombre}</p>

        {tieneOferta ? (
          <div className={styles.precioWrapper}>
            <span className={styles.precioOriginal}>
              S/. {producto.ofertaNavideña.precioOriginal.toFixed(2)}
            </span>
            <div className={styles.precioOfertaRow}>
              <span className={styles.precioOferta}>
                S/. {producto.ofertaNavideña.precioOferta.toFixed(2)}
              </span>
              <span className={styles.descuento}>
                -{producto.ofertaNavideña.descuento}%
              </span>
            </div>
          </div>
        ) : (
          <p className={styles.precio}>S/. {producto.precio.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}
