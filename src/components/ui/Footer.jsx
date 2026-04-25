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
      <div className={styles.div1} aria-label="Politicas del sitio">
        <p>Nuestras Políticas</p>
        <Link to="/politica-cookies">Política de cookies</Link>
        <Link to="/politica-privacidad">Política de privacidad</Link>
        <Link to="/terminos-condiciones">Términos y condiciones</Link>
      </div>
      <div className={styles.div2} aria-label="Enlaces principales">
        <p>Enlaces directos</p>
        <Link to="/inicia-sesion">Inicia Sesión</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/contacto">Contactanos</Link>
      </div>
      <div className={styles.div3}>
        <div className={styles.containerRedes}>
          <h4>Siguenos en:</h4>
          <div className={styles.linksSociales}>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Ir a Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Ir a Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Ir a TikTok"
            >
              <FontAwesomeIcon icon={faTiktok} />
            </a>
          </div>
        </div>
        <div className={styles.logo}>
          <img src={logo} alt="Logo de TechNova" width="50" height="50" />
          <h1>TechNova</h1>
        </div>
      </div>
    </footer>
  );
}
