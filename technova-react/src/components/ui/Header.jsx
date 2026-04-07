import styles from "../../css_components/Header.module.css";
import logo from "../../assets/img/logo.svg";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <a className={styles.headerLink} href="./index.html">
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.headerTitle}>TechNova</h1>
        </a>
      </header>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="./index.html">Inicio</a>
          </li>
          <li>
            <a href="./pages/productos.html">Productos</a>
          </li>
          <li>
            <a href="./pages/nosotros.html">Nosotros</a>
          </li>
          <li>
            <a href="./pages/contacto.html">Contacto</a>
          </li>
        </ul>
      </nav>
    </>
  );
}
