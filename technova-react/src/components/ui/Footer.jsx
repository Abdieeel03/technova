import logo from "../../assets/img/logo.svg";
import styles from "../../css_components/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        <a href="#">Política de cookies</a>
        <a href="#">Política de privacidad</a>
        <a href="#">Términos y condiciones</a>
      </div>
      <div className={styles.div2}>
        <p>Enlaces directos</p>
        <a href="#">Inicia Sesión</a>
        <a href="#">Productos</a>
        <a href="#">Contactanos</a>
      </div>
      <div className={styles.div3}>
        <div className={styles.containerRedes}>
          <h4>Siguenos en:</h4>
          <div className={styles.linksSociales}>
            <a href="">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
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
