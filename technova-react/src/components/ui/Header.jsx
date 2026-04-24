import styles from "../../css_components/Header.module.css";
import logo from "../../assets/img/logo.svg";
import { NavLink, Link } from "react-router";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <Link
          className={styles.headerLink}
          to="/"
          aria-label="Ir al inicio de TechNova"
        >
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.headerTitle}>TechNova</h1>
        </Link>
      </header>
      <nav className={styles.nav} aria-label="Navegacion principal">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              end
              aria-label="Ir a Inicio"
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              aria-label="Ir a Productos"
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/nosotros"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              aria-label="Ir a Nosotros"
            >
              Nosotros
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              aria-label="Ir a Contacto"
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
