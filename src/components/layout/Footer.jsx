import logo from "../../assets/img/logo.svg";
import styles from "../../css_components/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const location = useLocation();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  searchParams.set("modal", "login");

  const loginLinkTo = {
    pathname: location.pathname,
    search: `?${searchParams.toString()}`,
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.div1} aria-label={t.footer.nuestrasPoliticas}>
        <p>{t.footer.nuestrasPoliticas}</p>
        <Link to="/politica-cookies">{t.footer.politicaCookies}</Link>
        <Link to="/politica-privacidad">{t.footer.politicaPrivacidad}</Link>
        <Link to="/terminos-condiciones">{t.footer.terminosCondiciones}</Link>
        <Link to="/libro-reclamaciones">Libro de Reclamaciones</Link>
      </div>
      <div className={styles.div2} aria-label={t.footer.enlacesDirectos}>
        <p>{t.footer.enlacesDirectos}</p>
        <Link to={loginLinkTo}>{t.footer.iniciaSesion}</Link>
        <Link to="/productos">{t.nav.productos}</Link>
        <Link to="/contacto">{t.footer.contactanos}</Link>
      </div>
      <div className={styles.div3}>
        <div className={styles.containerRedes}>
          <h4>{t.footer.siguenos}</h4>
          <div className={styles.linksSociales}>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
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
