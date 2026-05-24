import { useState } from "react";
import data from "../../data/productos.json";
import ProductCard from "./ProductCard";
import styles from "../../css_components/CategoryCarousel.module.css";

const ITEMS_PER_PAGE = 6;

export default function CategoryCarousel({ tipo, titulo }) {
  const [visibles] = useState(data.productos.filter((p) => p.tipo === tipo));
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(visibles.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const paginados = visibles.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.titulo}>{titulo}</h2>
        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrow}
            onClick={prev}
            disabled={currentPage === 0}
          >
            &#8249;
          </button>
          <div className={styles.grid}>
            {paginados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
          <button
            className={styles.arrow}
            onClick={next}
            disabled={currentPage === totalPages - 1}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
