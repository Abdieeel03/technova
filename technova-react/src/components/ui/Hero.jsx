import { Link } from "react-router";
import styles from "../../css_components/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.tag}>Bienvenido a TechNova</p>
        <h1 className={styles.title}>
          Tecnología que <span className={styles.highlight}>transforma</span> tu
          mundo
        </h1>
        <p className={styles.subtitle}>
          Descubre los mejores productos tecnológicos con la mejor calidad y al
          mejor precio.
        </p>
        <Link to="/productos" className={styles.cta}>
          Ver productos
        </Link>
      </div>
    </section>
  );
}
