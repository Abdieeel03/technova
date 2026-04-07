import styles from "../../css_components/Header.module.css";
import logo from "../../assets/img/logo.svg";
import { NavLink, Link } from "react-router";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <Link className={styles.headerLink} to="/">
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.headerTitle}>TechNova</h1>
        </Link>
      </header>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              end
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
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
