import { useState, useEffect } from "react";
import data from "../data/productos.json";
import CardProducto from "../components/CardProducto";
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
  const { productos } = data;
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

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
          {productosFiltrados.length > 0 ? (
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
