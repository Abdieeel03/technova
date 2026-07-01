import { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import { fetchProductos } from "../../services/productosApi";
import styles from "../../css_components/CategoryCarousel.module.css";
import { useLanguage } from "../../context/LanguageContext";

const ITEMS_PER_PAGE = 6;

export default function CategoryCarousel({
  tipo,
  icono,
  titulo,
  productos,
  isLoading: isLoadingProp,
  error: errorProp,
}) {
  const { t } = useLanguage();
  const [visiblesFallback, setVisiblesFallback] = useState([]);
  const [isLoadingFallback, setIsLoadingFallback] = useState(true);
  const [errorFallback, setErrorFallback] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const isControlled = productos !== undefined;
  const visibles = isControlled ? productos : visiblesFallback;
  const isLoading = isControlled ? Boolean(isLoadingProp) : isLoadingFallback;
  const error = isControlled ? errorProp : errorFallback;

  const totalPages = Math.ceil(visibles.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const paginados = visibles.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  useEffect(() => {
    if (isControlled) {
      return undefined;
    }

    const controller = new AbortController();

    fetchProductos({ tipo }, controller.signal)
      .then((productosData) => {
        setVisiblesFallback(productosData);
        setErrorFallback(null);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setErrorFallback(t.home.errorCategoria);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingFallback(false);
        }
      });

    return () => controller.abort();
  }, [isControlled, tipo]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.iconBubble}>{icono}</span>
          <div>
            <span className={styles.kicker}>{t.home.porCategoria}</span>
            <h2 className={styles.titulo}>{titulo}</h2>
          </div>
        </div>
        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrow}
            onClick={prev}
            disabled={currentPage === 0 || isLoading}
            aria-label={t.common.anterior}
          >
            &#8249;
          </button>
          <div className={styles.grid}>
            {isLoading ? (
              <p>{t.common.cargandoProductos}</p>
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
            aria-label={t.common.siguiente}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
