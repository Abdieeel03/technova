import { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import { fetchProductos } from "../../services/productosApi";
import styles from "../../css_components/BestSellers.module.css";

const ITEMS_PER_PAGE = 6;

export default function BestSellers({
  productos,
  isLoading: isLoadingProp,
  error: errorProp,
}) {
  const [masVendidosFallback, setMasVendidosFallback] = useState([]);
  const [isLoadingFallback, setIsLoadingFallback] = useState(true);
  const [errorFallback, setErrorFallback] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const isControlled = productos !== undefined;
  const masVendidos = isControlled ? productos : masVendidosFallback;
  const isLoading = isControlled ? Boolean(isLoadingProp) : isLoadingFallback;
  const error = isControlled ? errorProp : errorFallback;

  const totalPages = Math.ceil(masVendidos.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const paginados = masVendidos.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  useEffect(() => {
    if (isControlled) {
      return undefined;
    }

    const controller = new AbortController();

    fetchProductos({ masVendido: true }, controller.signal)
      .then((productosData) => {
        setMasVendidosFallback(productosData);
        setErrorFallback(null);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setErrorFallback("No se pudieron cargar los más vendidos.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingFallback(false);
        }
      });

    return () => controller.abort();
  }, [isControlled]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.kicker}>Tendencia ahora</span>
            <h2 className={styles.titulo}>Más Vendidos</h2>
          </div>
          <span className={styles.flameBadge}>🔥 Top ventas</span>
        </div>
        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrow}
            onClick={prev}
            disabled={currentPage === 0 || isLoading}
            aria-label="Anterior"
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
            disabled={
              isLoading || totalPages <= 1 || currentPage === totalPages - 1
            }
            aria-label="Siguiente"
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
