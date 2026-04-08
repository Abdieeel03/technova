import { Link } from "react-router";
import styles from "../../css_components/ProductCard.module.css";

export default function ProductCard({ producto }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.marca}>{producto.marca}</span>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.precio}>${producto.precio.toFixed(2)}</p>
      </div>
      <Link to={`/productos/${producto.id}`} className={styles.boton}>
        Ver detalle
      </Link>
    </div>
  );
}
