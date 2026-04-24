import { Link } from "react-router";
import styles from "../css_components/InfoPage.module.css";

export default function NotFound() {
  return (
    <section className={styles.wrapper} aria-labelledby="not-found-title">
      <div className={styles.card}>
        <p className={styles.tag}>Error 404</p>
        <h2 id="not-found-title">Pagina no encontrada</h2>
        <p>
          La ruta que intentaste abrir no existe o fue movida. Puedes continuar
          explorando nuestros productos desde el inicio.
        </p>
        <Link
          to="/productos"
          className={styles.cta}
          aria-label="Ir al catalogo de productos"
        >
          Ir a productos
        </Link>
      </div>
    </section>
  );
}
