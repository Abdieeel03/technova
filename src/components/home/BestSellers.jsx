import { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import { fetchProductos } from "../../services/productosApi";
import styles from "../../css_components/BestSellers.module.css";

const ITEMS_PER_PAGE = 6;

export default function BestSellers() {
  const [masVendidos, setMasVendidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(masVendidos.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const paginados = masVendidos.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  useEffect(() => {
    const controller = new AbortController();

    fetchProductos({ masVendido: true }, controller.signal)
      .then((productosData) => {
        setMasVendidos(productosData);
        setError(null);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setError("No se pudieron cargar los más vendidos.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.titulo}>🔥 Más Vendidos</h2>
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
