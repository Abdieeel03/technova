import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/Daltonismo.module.css";

export default function Daltonismo() {
  const [active, setActive] = useState(false);

  // Escuchar eventos del perfil "Daltonismo"
  useEffect(() => {
    const handleProfileDaltonismo = (e) => {
      if (e.detail && typeof e.detail.active === "boolean") {
        setActive(e.detail.active);
      }
    };

    window.addEventListener("set-daltonismo", handleProfileDaltonismo);
    return () => {
      window.removeEventListener("set-daltonismo", handleProfileDaltonismo);
    };
  }, []);

  // Aplicar modo daltonismo en el body
  useEffect(() => {
    if (active) {
      document.body.setAttribute("data-daltonismo", "true");
    } else {
      document.body.removeAttribute("data-daltonismo");
    }
  }, [active]);

  const toggle = () => {
    setActive((prev) => !prev);
  };

  return (
    <button
      onClick={toggle}
      className={`${styles.widgetButton} ${active ? styles.activeButton : ""}`}
      aria-pressed={active}
      aria-label={`Daltonismo: ${active ? "activado" : "desactivado"}`}
      type="button"
    >
      {/* Icono: gota de contraste/color */}
      <svg viewBox="0 0 24 24" className={styles.iconSvg}>
        <path
          d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z"
          fill="none"
          stroke="var(--color-text)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Mitad oscura para contraste */}
        <path
          d="M12 2C12 2 5 10 5 15a7 7 0 0 0 7 7V2z"
          fill="var(--color-text)"
          stroke="none"
        />
      </svg>

      <span className={styles.label}>Contrastes</span>

      {/* Toggle switch visual */}
      <div className={styles.toggleTrack}>
        <div
          className={`${styles.toggleHandle} ${active ? styles.activeHandle : ""}`}
        />
      </div>
    </button>
  );
}
