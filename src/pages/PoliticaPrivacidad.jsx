import { useEffect } from "react";
import { Link } from "react-router";
import styles from "../css_components/PoliticaCookies.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function PoliticaPrivacidad() {
  const { t } = useLanguage();
  const p = t.politicaPrivacidad;

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
        <div className={styles.bloque}>
          <p>{p.introTexto}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s1Titulo}</h2>
          <p>{p.s1Texto}</p>
          <ul className={styles.lista}>
            <li>{p.s1Item1}</li>
            <li>{p.s1Item2}</li>
            <li>{p.s1Item3}</li>
            <li>{p.s1Item4}</li>
          </ul>
          <p className={styles.nota}>{p.s1Nota}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s2Titulo}</h2>
          <p>{p.s2Texto}</p>
          <ul className={styles.lista}>
            <li>{p.s2Item1}</li>
            <li>{p.s2Item2}</li>
            <li>{p.s2Item3}</li>
            <li>{p.s2Item4}</li>
          </ul>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s3Titulo}</h2>
          <p>{p.s3Texto}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s4Titulo}</h2>
          <p>{p.s4Texto}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s4bTitulo}</h2>
          <p>{p.s4bTexto}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s5Titulo}</h2>
          <p>{p.s5Texto}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s6Titulo}</h2>
          <p>{p.s6Texto}</p>
          <ul className={styles.lista}>
            <li>{p.s6Item1}</li>
            <li>{p.s6Item2}</li>
            <li>{p.s6Item3}</li>
          </ul>
          <p className={styles.nota}>{p.s6Nota}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s7Titulo}</h2>
          <p>{p.s7Texto}</p>
        </div>

        <div className={styles.bloque}>
          <h2>{p.s8Titulo}</h2>
          <p>
            {p.s8Texto}{" "}
            <Link to="/contacto" className={styles.link}>
              {p.s8Link}
            </Link>
          </p>
        </div>
      </section>
    </section>
  );
}