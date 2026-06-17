import { Link } from "react-router";
import styles from "../../css_components/Hero.module.css";
import { useLanguage } from "../../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.tag}>{t.hero.tag}</p>
        <h1 className={styles.title}>
          {t.hero.titulo.split(t.hero.tituloHighlight)[0]}
          <span className={styles.highlight}>{t.hero.tituloHighlight}</span>
          {t.hero.titulo.split(t.hero.tituloHighlight)[1]}
        </h1>
        <p className={styles.subtitle}>{t.hero.subtitulo}</p>
        <Link to="/productos" className={styles.cta}>
          {t.hero.cta}
        </Link>
      </div>
    </section>
  );
}
