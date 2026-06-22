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
  { key: "laptops", label: "Laptops" },
  { key: "celulares", label: "Celulares" },
  { key: "componentes", label: "Componentes" },
];

const RANGOS_PRECIO = [
  { label: "Hasta S/. 100", min: 0, max: 100 },
  { label: "S/. 100 a S/. 300", min: 100, max: 300 },
  { label: "S/. 300 a S/. 800", min: 300, max: 800 },
  { label: "S/. 800 a S/. 2000", min: 800, max: 2000 },
  { label: "Más de S/. 2000", min: 2000, max: 99999 },
];

const PRODUCTOS_POR_PAGINA = 12;
const MARCAS_VISIBLES = 4;
const SCROLL_KEY = "productos_scroll_pos";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "todos";
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [rangoActivo, setRangoActivo] = useState(null);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [inputMin, setInputMin] = useState("");
  const [inputMax, setInputMax] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [verMasMarcas, setVerMasMarcas] = useState(false);

  const setCategoriaActiva = (key) => {
    setMarcasSeleccionadas([]);
    setPaginaActual(1);
    if (key === "todos") setSearchParams({});
    else setSearchParams({ categoria: key });
  };

  const productosCat =
    categoriaActiva === "todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  const marcasDisponibles = [
    ...new Set(productosCat.map((p) => p.marca)),
  ].sort();

  const toggleMarca = (marca) => {
    setPaginaActual(1);
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  const aplicarRango = (rango) => {
    if (rangoActivo?.label === rango.label) {
      setRangoActivo(null);
      setPrecioMin("");
      setPrecioMax("");
      setInputMin("");
      setInputMax("");
    } else {
      setRangoActivo(rango);
      setPrecioMin(rango.min);
      setPrecioMax(rango.max);
      setInputMin(rango.min === 0 ? "" : String(rango.min));
      setInputMax(rango.max === 99999 ? "" : String(rango.max));
    }
    setPaginaActual(1);
  };

  const aplicarInputs = () => {
    const min = inputMin === "" ? 0 : Number(inputMin);
    const max = inputMax === "" ? 99999 : Number(inputMax);
    setPrecioMin(min);
    setPrecioMax(max);
    setRangoActivo(null);
    setPaginaActual(1);
  };

  const productosFiltrados = productosCat
    .filter(
      (p) =>
        marcasSeleccionadas.length === 0 ||
        marcasSeleccionadas.includes(p.marca)
    )
    .filter((p) => {
      const min = precioMin === "" ? 0 : Number(precioMin);
      const max = precioMax === "" ? 99999 : Number(precioMax);
      return p.precio >= min && p.precio <= max;
    });

  const totalPaginas = Math.ceil(
    productosFiltrados.length / PRODUCTOS_POR_PAGINA
  );
  const paginaSegura = totalPaginas > 0 ? Math.min(paginaActual, totalPaginas) : 1;
  const inicio = (paginaSegura - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = productosFiltrados.slice(
    inicio,
    inicio + PRODUCTOS_POR_PAGINA
  );

  const irAPagina = (n) => {
    setPaginaActual(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginas = () => {
    if (totalPaginas <= 7)
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const pages = [];
    if (paginaSegura <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPaginas);
    } else if (paginaSegura >= totalPaginas - 3) {
      pages.push(1, "...", totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas);
    } else {
      pages.push(1, "...", paginaSegura - 1, paginaSegura, paginaSegura + 1, "...", totalPaginas);
    }
    return pages;
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

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () =>
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Nuestros Productos</h1>
        <p className={styles.heroSubtitle}>
          Descubre la mejor tecnología al mejor precio
        </p>
        <span className={styles.totalProductos}>
          {productos.length} productos disponibles
        </span>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>
            <span className={styles.sidebarTitleIcon}>≡</span> Filtros
          </h3>

          {/* Categorías */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Categoría</p>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.sidebarBtn} ${
                  categoriaActiva === cat.key ? styles.sidebarBtnActivo : ""
                }`}
                onClick={() => setCategoriaActiva(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Marcas */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Marca</p>
            {marcasDisponibles
              .slice(0, verMasMarcas ? marcasDisponibles.length : MARCAS_VISIBLES)
              .map((marca) => (
                <label key={marca} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={marcasSeleccionadas.includes(marca)}
                    onChange={() => toggleMarca(marca)}
                  />
                  {marca}
                </label>
              ))}
            {marcasDisponibles.length > MARCAS_VISIBLES && (
              <button
                className={styles.verMasBtn}
                onClick={() => setVerMasMarcas((v) => !v)}
              >
                {verMasMarcas ? "▴ Ver menos" : "▾ Ver más"}
              </button>
            )}
          </div>

          {/* Precio */}
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Precio</p>
            {RANGOS_PRECIO.map((rango) => (
              <button
                key={rango.label}
                className={`${styles.rangoBtn} ${
                  rangoActivo?.label === rango.label ? styles.rangoBtnActivo : ""
                }`}
                onClick={() => aplicarRango(rango)}
              >
                {rango.label}
              </button>
            ))}
            <div className={styles.precioInputs}>
              <input
                type="number"
                className={styles.precioInput}
                placeholder="Mínimo"
                value={inputMin}
                onChange={(e) => { setInputMin(e.target.value); setRangoActivo(null); }}
              />
              <span className={styles.precioSep}>–</span>
              <input
                type="number"
                className={styles.precioInput}
                placeholder="Máximo"
                value={inputMax}
                onChange={(e) => { setInputMax(e.target.value); setRangoActivo(null); }}
              />
            </div>
            <button className={styles.aplicarBtn} onClick={aplicarInputs}>
              Aplicar
            </button>
          </div>

          {/* Limpiar */}
          <button
            className={styles.limpiarBtn}
            onClick={() => {
              setMarcasSeleccionadas([]);
              setRangoActivo(null);
              setPrecioMin("");
              setPrecioMax("");
              setInputMin("");
              setInputMax("");
              setPaginaActual(1);
              setVerMasMarcas(false);
            }}
          >
            Limpiar filtros
          </button>
        </aside>

        <section className={styles.container}>
          <div className={styles.resultInfo}>
            <span>
              {productosFiltrados.length} producto
              {productosFiltrados.length !== 1 ? "s" : ""} encontrado
              {productosFiltrados.length !== 1 ? "s" : ""}
            </span>
            {totalPaginas > 1 && (
              <span>Página {paginaSegura} de {totalPaginas}</span>
            )}
          </div>

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
            ) : productosPagina.length > 0 ? (
              productosPagina.map((producto, index) => (
                <div
                  key={producto.id}
                  className={styles.cardWrapper}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
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

          {totalPaginas > 1 && (
            <div className={styles.paginacion}>
              <button
                className={styles.pgBtn}
                onClick={() => irAPagina(paginaSegura - 1)}
                disabled={paginaSegura === 1}
                aria-label="Página anterior"
              >
                ‹
              </button>
              {getPaginas().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className={styles.pgDots}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`${styles.pgBtn} ${paginaSegura === p ? styles.pgBtnActivo : ""}`}
                    onClick={() => irAPagina(p)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                className={styles.pgBtn}
                onClick={() => irAPagina(paginaSegura + 1)}
                disabled={paginaSegura === totalPaginas}
                aria-label="Página siguiente"
              >
                ›
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
