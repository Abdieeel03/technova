import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CardProducto from "../components/products/CardProducto";
import { fetchProductos } from "../services/productosApi";
import styles from "../css_components/Productos.module.css";

const CATEGORIAS = [
  { key: "todos", label: "Todos" },
  { key: "audio", label: "Audio" },
  { key: "gaming", label: "Gaming" },
  { key: "accesorios", label: "Accesorios" },
  { key: "camaras", label: "Cámaras" },
];

const SCROLL_KEY = "productos_scroll_pos";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "todos";

  const setCategoriaActiva = (key) => {
    if (key === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: key });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchProductos(undefined, controller.signal)
      .then((productosData) => {
        setProductos(productosData);
        setError(null);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setError("No se pudieron cargar los productos.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  /* Restaurar posición de scroll al volver */
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  /* Guardar posición de scroll al salir */
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productosFiltrados =
    categoriaActiva === "todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  return (
    <main className={styles.page}>
      {/* ── Hero banner ── */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Nuestros Productos</h1>
        <p className={styles.heroSubtitle}>
          Descubre la mejor tecnología al mejor precio
        </p>
        <span className={styles.totalProductos}>
          {productos.length} productos disponibles
        </span>
      </section>

      {/* ── Filtros ── */}
      <div className={styles.filtros}>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.filtroBtn} ${
              categoriaActiva === cat.key ? styles.filtroBtnActivo : ""
            }`}
            onClick={() => setCategoriaActiva(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Grid de productos ── */}
      <section className={styles.container}>
        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>Cargando productos...</h3>
            </div>
          ) : error ? (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>{error}</h3>
              <p className={styles.noResultsText}>Intenta nuevamente en unos minutos</p>
            </div>
          ) : productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto, index) => (
              <div
                key={producto.id}
                className={styles.cardWrapper}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CardProducto producto={producto} />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>
                No se encontraron productos
              </h3>
              <p className={styles.noResultsText}>
                Intenta con otra categoría
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
