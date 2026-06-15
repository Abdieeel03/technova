import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import data from "../data/productos.json";
import CardProducto from "../components/products/CardProducto";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "todos";
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [precioMax, setPrecioMax] = useState(5000);

  const setCategoriaActiva = (key) => {
    setMarcasSeleccionadas([]);
    if (key === "todos") setSearchParams({});
    else setSearchParams({ categoria: key });
  };

  /* Marcas disponibles según categoría activa */
  const productosCat = categoriaActiva === "todos"
    ? productos
    : productos.filter((p) => p.categoria === categoriaActiva);

  const marcasDisponibles = [...new Set(productosCat.map((p) => p.marca))].sort();

  const toggleMarca = (marca) => {
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  /* Filtrado final */
  const productosFiltrados = productosCat
    .filter((p) => marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(p.marca))
    .filter((p) => p.precio <= precioMax);

  /* Scroll */
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Nuestros Productos</h1>
        <p className={styles.heroSubtitle}>Descubre la mejor tecnología al mejor precio</p>
        <span className={styles.totalProductos}>{productos.length} productos disponibles</span>
      </section>

      <div className={styles.layout}>
        {/* Panel lateral */}
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Filtros</h3>

          {/* Categorías */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Categoría</p>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.sidebarBtn} ${categoriaActiva === cat.key ? styles.sidebarBtnActivo : ""}`}
                onClick={() => setCategoriaActiva(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Marcas */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Marca</p>
            {marcasDisponibles.map((marca) => (
              <label key={marca} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={marcasSeleccionadas.includes(marca)}
                  onChange={() => toggleMarca(marca)}
                />
                {marca}
              </label>
            ))}
          </div>

          {/* Precio */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Precio máximo: S/. {precioMax}</p>
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.precioRange}>
              <span>S/. 0</span>
              <span>S/. 5000</span>
            </div>
          </div>

          {/* Limpiar filtros */}
          <button className={styles.limpiarBtn} onClick={() => { setMarcasSeleccionadas([]); setPrecioMax(5000); }}>
            Limpiar filtros
          </button>
        </aside>

        {/* Grid */}
        <section className={styles.container}>
          <div className={styles.grid}>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto, index) => (
                <div key={producto.id} className={styles.cardWrapper} style={{ animationDelay: `${index * 0.08}s` }}>
                  <CardProducto producto={producto} />
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3 className={styles.noResultsTitle}>No se encontraron productos</h3>
                <p className={styles.noResultsText}>Intenta con otra categoría o filtro</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}