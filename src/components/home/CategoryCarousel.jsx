import { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import { fetchProductos } from "../../services/productosApi";
import styles from "../../css_components/CategoryCarousel.module.css";

const ITEMS_PER_PAGE = 6;

export default function CategoryCarousel({ tipo, titulo }) {
  const [visibles, setVisibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(visibles.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const paginados = visibles.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  useEffect(() => {
    const controller = new AbortController();

    setCurrentPage(0);
    setIsLoading(true);
    setError(null);

    fetchProductos({ tipo }, controller.signal)
      .then((productosData) => {
        setVisibles(productosData);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setError("No se pudieron cargar estos productos.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [tipo]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.titulo}>{titulo}</h2>
        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrow}
            onClick={prev}
            disabled={currentPage === 0 || isLoading}
          >
            &#8249;
          </button>
          <div className={styles.grid}>
            {isLoading ? (
              <p>Cargando productos...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              paginados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            )}
          </div>
          <button
            className={styles.arrow}
            onClick={next}
            disabled={isLoading || totalPages <= 1 || currentPage === totalPages - 1}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
