import data from "../../data/productos.json";
import ProductCard from "../products/ProductCard";
import styles from "../../css_components/BestSellers.module.css";

export default function BestSellers() {
  const masVendidos = data.productos.filter((p) => p.masVendido);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.titulo}>🔥 Más Vendidos</h2>
        <div className={styles.grid}>
          {masVendidos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </div>
    </section>
  );
}
