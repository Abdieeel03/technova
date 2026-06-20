import { useEffect, useState } from "react";
import ProductCard from "../products/ProductCard";
import { fetchProductos } from "../../services/productosApi";
import styles from "../../css_components/FeaturedProducts.module.css";

const ITEMS_PER_PAGE = 6;

export default function FeaturedProducts({ productos: productosProp, isLoading: isLoadingProp, error: errorProp }) {
  const [productosFallback, setProductosFallback] = useState([]);
  const [isLoadingFallback, setIsLoadingFallback] = useState(true);
  const [errorFallback, setErrorFallback] = useState(null);
  const [page, setPage] = useState(0);
  const isControlled = productosProp !== undefined;
  const productos = isControlled ? productosProp : productosFallback;
  const isLoading = isControlled ? Boolean(isLoadingProp) : isLoadingFallback;
  const error = isControlled ? errorProp : errorFallback;

  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visibles = productos.slice(start, start + ITEMS_PER_PAGE);

  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const next = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  useEffect(() => {
    if (isControlled) {
      return undefined;
    }

    const controller = new AbortController();

    fetchProductos({ limit: 12 }, controller.signal)
      .then((productosData) => {
        setProductosFallback(productosData);
        setErrorFallback(null);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setErrorFallback("No se pudieron cargar los productos destacados.");
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
        <h2 className={styles.titulo}>¡Lo mejor de TechNova!</h2>
        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrow}
            onClick={prev}
            disabled={page === 0 || isLoading}
          >
            &#8249;
          </button>
          <div className={styles.grid}>
            {isLoading ? (
              <p>Cargando productos...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              visibles.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            )}
          </div>
          <button
            className={styles.arrow}
            onClick={next}
            disabled={isLoading || totalPages <= 1 || page === totalPages - 1}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
