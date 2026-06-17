import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import data from "../data/productos.json";
import CardProducto from "../components/products/CardProducto";
import styles from "../css_components/Productos.module.css";
import { useLanguage } from "../context/LanguageContext";

const SCROLL_KEY = "productos_scroll_pos";

export default function Productos() {
  const { productos } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const categoriaActiva = searchParams.get("categoria") || "todos";

  const setCategoriaActiva = (key) => {
    if (key === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: key });
    }
  };

  const CATEGORIAS = [
    { key: "todos", label: t.productos.categorias.todos },
    { key: "audio", label: t.productos.categorias.audio },
    { key: "gaming", label: t.productos.categorias.gaming },
    { key: "accesorios", label: t.productos.categorias.accesorios },
    { key: "camaras", label: t.productos.categorias.camaras },
  ];

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

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
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{t.productos.titulo}</h1>
        <p className={styles.heroSubtitle}>{t.productos.subtitulo}</p>
        <span className={styles.totalProductos}>
          {productos.length} {t.productos.disponibles}
        </span>
      </section>

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
                {t.productos.noResultados}
              </h3>
              <p className={styles.noResultsText}>{t.productos.otraCat}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
