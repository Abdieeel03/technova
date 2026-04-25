import { useParams, Link } from "react-router";
import { useEffect } from "react";
import data from "../data/productos.json";
import styles from "../css_components/DetalleProducto.module.css";

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = data.productos.find((p) => p.id === Number(id));

  /* Scroll al top al entrar a la página */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* ── Producto no encontrado ── */
  if (!producto) {
    return (
      <main className={styles.page}>
        <div className={styles.backBar}>
          <div className={styles.backBarInner}>
            <Link to="/productos" className={styles.backLink}>
              <span className={styles.backIcon}>←</span> Volver a Productos
            </Link>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>📦</div>
            <h2 className={styles.notFoundTitle}>Producto no encontrado</h2>
            <p className={styles.notFoundText}>
              El producto que buscas no existe o fue eliminado.
            </p>
            <Link to="/productos" className={styles.notFoundBtn}>
              ← Ver todos los productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tieneOferta =
    producto.ofertaNavideña && producto.ofertaNavideña.activa;

  const ahorro = tieneOferta
    ? (producto.ofertaNavideña.precioOriginal - producto.ofertaNavideña.precioOferta).toFixed(2)
    : null;

  return (
    <main className={styles.page}>
      {/* ── Barra de navegación / Breadcrumb ── */}
      <div className={styles.backBar}>
        <div className={styles.backBarInner}>
          <Link to="/productos" className={styles.backLink}>
            <span className={styles.backIcon}>←</span> Productos
          </Link>
          <span className={styles.breadcrumb}>
            / <span>{producto.nombre}</span>
          </span>
        </div>
      </div>

      <div className={styles.container}>
        {/* ── Sección superior: Imagen + Info ── */}
        <div className={styles.topSection}>
          {/* Imagen del producto */}
          <div className={`${styles.imageCard} ${styles.fadeIn}`}>
            {tieneOferta && (
              <span className={styles.badgeOferta}>
                {producto.ofertaNavideña.etiqueta}
              </span>
            )}
            <div className={styles.imageWrapper}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className={styles.mainImage}
              />
            </div>
          </div>

          {/* Panel de información */}
          <div className={`${styles.infoPanel} ${styles.fadeInDelay}`}>
            <span className={styles.categoria}>{producto.categoria}</span>
            <h1 className={styles.nombre}>{producto.nombre}</h1>
            <span className={styles.marca}>por {producto.marca}</span>

            {/* Precios */}
            <div className={styles.precioSection}>
              {tieneOferta ? (
                <>
                  <span className={styles.precioOferta}>
                    ${producto.ofertaNavideña.precioOferta.toFixed(2)}
                  </span>
                  <span className={styles.precioOriginal}>
                    ${producto.ofertaNavideña.precioOriginal.toFixed(2)}
                  </span>
                  <span className={styles.descuentoBadge}>
                    -{producto.ofertaNavideña.descuento}%
                  </span>
                </>
              ) : (
                <span className={styles.precioActual}>
                  ${producto.precio.toFixed(2)}
                </span>
              )}
            </div>

            {tieneOferta && (
              <span className={styles.ahorro}>
                💰 Ahorras ${ahorro} con esta oferta
              </span>
            )}

            {/* Descripción detallada */}
            <p className={styles.descripcion}>
              {producto.descripcionDetallada}
            </p>

            <hr className={styles.divider} />

            {/* Stock y Garantía */}
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📦</span>
                <span
                  className={
                    producto.stock <= 10 ? styles.stockRojo : styles.stockVerde
                  }
                >
                  {producto.stock <= 10
                    ? `¡Solo quedan ${producto.stock} unidades!`
                    : `${producto.stock} unidades disponibles`}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>🛡️</span>
                <span className={styles.garantia}>
                  Garantía de {producto.garantia}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sección inferior: Características + Especificaciones ── */}
        <div className={styles.bottomSection}>
          {/* Características */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardTitleIcon}>✨</span>
              Características
            </h2>
            <ul className={styles.featureList}>
              {producto.caracteristicas.map((item, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.featureCheck}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Especificaciones */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardTitleIcon}>📋</span>
              Especificaciones
            </h2>
            <table className={styles.specTable}>
              <tbody>
                {Object.entries(producto.especificaciones).map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td className={styles.specLabel}>{key}</td>
                      <td className={styles.specValue}>{value}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
