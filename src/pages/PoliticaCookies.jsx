import { useEffect } from "react";
import styles from "../css_components/PoliticaCookies.module.css";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router";


export default function PoliticaCookies() {
  const { t } = useLanguage();
  const p = t.politicaCookies;

useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className={styles.politicaMain}>
      <div className={styles.politicaHeader}>
        <h1>{p.titulo}</h1>
        <p>{p.subtitulo}</p>
        <span className={styles.actualizado}>{p.actualizado}</span>
      </div>

      <section className={styles.contenido}>
        {/* Sección 1 */}
        <div className={styles.bloque}>
          <h2>{p.s1Titulo}</h2>
          <p>{p.s1Texto}</p>
        </div>

        {/* Sección 2 - Tabla */}
        <div className={styles.bloque}>
          <h2>{p.s2Titulo}</h2>
          <p>{p.s2Texto}</p>

          <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>{p.tablaDato}</th>
                  <th>{p.tablaFinalidad}</th>
                  <th>{p.tablaTipo}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{p.datoSesion}</td>
                  <td>{p.finSesion}</td>
                  <td>localStorage</td>
                </tr>
                <tr>
                  <td>{p.datoCarrito}</td>
                  <td>{p.finCarrito}</td>
                  <td>localStorage</td>
                </tr>
                <tr>
                  <td>{p.datoScroll}</td>
                  <td>{p.finScroll}</td>
                  <td>sessionStorage</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.nota}>{p.s2Nota}</p>
        </div>

        {/* Sección 3 */}
        <div className={styles.bloque}>
          <h2>{p.s3Titulo}</h2>
          <p>{p.s3Texto}</p>
          <ul className={styles.lista}>
            <li>{p.s3Item1}</li>
            <li>{p.s3Item2}</li>
            <li>{p.s3Item3}</li>
          </ul>
          <p className={styles.nota}>{p.s3Nota}</p>
        </div>

        {/* Sección 4 */}
        <div className={styles.bloque}>
          <h2>{p.s4Titulo}</h2>
          <p>{p.s4Texto}</p>
        </div>

        {/* Sección 5 */}
        <div className={styles.bloque}>
          <h2>{p.s5Titulo}</h2>
          <p>{p.s5Texto}</p>
          <ul className={styles.lista}>
            <li>{p.s5Item1}</li>
            <li>{p.s5Item2}</li>
            <li>{p.s5Item3}</li>
          </ul>
          <p className={styles.nota}>{p.s5Nota}</p>
        </div>

        {/* Sección 6 */}
        <div className={styles.bloque}>
          <h2>{p.s6Titulo}</h2>
          <p>{p.s6Texto}</p>
        </div>

        {/* Sección 7 - Contacto */}
        <div className={styles.bloque}>
          <h2>{p.s7Titulo}</h2>
          <p>
  {p.s7Texto}{" "}
  <Link to="/contacto" className={styles.link}>
    nuestra página de contacto
  </Link>
</p>
        </div>
      </section>
    </section>
  );
}