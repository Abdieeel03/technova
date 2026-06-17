import styles from "../css_components/Nosotros.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";

export default function Nosotros() {
  const { t } = useLanguage();

  return (
    <section className={styles.nosotrosMain}>
      <div className={styles.nosotrosHeader}>
        <h1>{t.nosotros.titulo}</h1>
        <p>{t.nosotros.subtitulo}</p>
      </div>

      <section className={styles.empresaInfo}>
        <div className={styles.empresaDescripcion}>
          <h2>{t.nosotros.quienesSomos}</h2>
          <p>{t.nosotros.descripcion}</p>
        </div>

        <div className={styles.misionVisionContainer}>
          <div className={styles.misionCard}>
            <h3>
              <FontAwesomeIcon icon={faBullseye} />
              {t.nosotros.mision}
            </h3>
            <p>{t.nosotros.misionDesc}</p>
          </div>

          <div className={styles.visionCard}>
            <h3>
              <FontAwesomeIcon icon={faEye} />
              {t.nosotros.vision}
            </h3>
            <p>{t.nosotros.visionDesc}</p>
          </div>
        </div>
      </section>
    </section>
  );
}
