import { Link } from "react-router-dom";
import styles from "../../css_components/ProductCard.module.css";

export default function ProductCard({ producto }) {
  return (
    <Link to={`/productos`} className={styles.card}>
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
        <p className={styles.precio}>${producto.precio.toFixed(2)}</p>
      </div>
    </Link>
  );
}
