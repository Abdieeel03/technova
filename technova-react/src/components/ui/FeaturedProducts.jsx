import data from "../../data/productos.json";
import ProductCard from "./ProductCard";
import styles from "../../css_components/FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const { productos } = data;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Nuestros Productos</h2>
        <p className={styles.subtitulo}>
          Encuentra la tecnología que necesitas
        </p>
      </div>
      <div className={styles.grid}>
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}
