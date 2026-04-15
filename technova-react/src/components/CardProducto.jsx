import { Link } from "react-router";
import styles from "../css_components/CardProducto.module.css";

export default function CardProducto({ producto }) {
  const tieneOferta =
    producto.ofertaNavideña && producto.ofertaNavideña.activa;

  return (
    <Link to={`/productos/${producto.id}`} className={styles.card}>
      {tieneOferta && (
        <span className={styles.badge}>{producto.ofertaNavideña.etiqueta}</span>
      )}

      <div className={styles.imageContainer}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.info}>
        <span className={styles.categoria}>{producto.categoria}</span>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <span className={styles.marca}>{producto.marca}</span>
        <p className={styles.descripcion}>{producto.descripcion}</p>

        <div className={styles.precioWrapper}>
          {tieneOferta ? (
            <>
              <span className={styles.precioOferta}>
                ${producto.ofertaNavideña.precioOferta.toFixed(2)}
              </span>
              <span className={styles.precioOriginal}>
                ${producto.ofertaNavideña.precioOriginal.toFixed(2)}
              </span>
              <span className={styles.descuento}>
                -{producto.ofertaNavideña.descuento}%
              </span>
            </>
          ) : (
            <span className={styles.precio}>
              ${producto.precio.toFixed(2)}
            </span>
          )}
        </div>

        <span
          className={`${styles.stock} ${producto.stock <= 10 ? styles.stockBajo : ""}`}
        >
          {producto.stock <= 10
            ? `¡Solo quedan ${producto.stock} unidades!`
            : `${producto.stock} disponibles`}
        </span>

        <span className={styles.verMas}>
          Ver detalles
          <span className={styles.verMasIcon}>→</span>
        </span>
      </div>
    </Link>
  );
}
