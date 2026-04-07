import logo from "../../assets/img/logo.svg";
import styles from "../../css_components/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.div1}>
        <p>Nuestras Políticas</p>
        <Link to="/politica-cookies">Política de cookies</Link>
        <Link to="/politica-privacidad">Política de privacidad</Link>
        <Link to="/terminos-condiciones">Términos y condiciones</Link>
      </div>
      <div className={styles.div2}>
        <p>Enlaces directos</p>
        <Link to="/inicia-sesion">Inicia Sesión</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/contacto">Contactanos</Link>
      </div>
      <div className={styles.div3}>
        <div className={styles.containerRedes}>
          <h4>Siguenos en:</h4>
          <div className={styles.linksSociales}>
            <Link to="https://www.facebook.com/" target="_blank">
              <FontAwesomeIcon icon={faFacebookF} />
            </Link>
            <Link to="https://www.instagram.com/" target="_blank">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link to="https://www.tiktok.com/" target="_blank">
              <FontAwesomeIcon icon={faTiktok} />
            </Link>
          </div>
        </div>
        <div className={styles.logo}>
          <img src={logo} alt="" width="50px" height="50px" />
          <h1>TechNova</h1>
        </div>
      </div>
    </footer>
  );
}
