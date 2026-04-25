import { useState } from "react";
import data from "../../data/productos.json";
import ProductCard from "./ProductCard";
import styles from "../../css_components/FeaturedProducts.module.css";

const ITEMS_PER_PAGE = 6;

export default function FeaturedProducts() {
  const { productos } = data;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visibles = productos.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const next = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.titulo}>¡Lo mejor de TechNova!</h2>
        <div className={styles.carouselWrapper}>
          <button className={styles.arrow} onClick={prev} disabled={page === 0}>
            &#8249;
          </button>
          <div className={styles.grid}>
            {visibles.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
          <button
            className={styles.arrow}
            onClick={next}
            disabled={page === totalPages - 1}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
