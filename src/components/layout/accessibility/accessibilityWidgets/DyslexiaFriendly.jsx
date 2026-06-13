import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/DyslexiaFriendly.module.css";

export default function DyslexiaFriendly() {
  const [active, setActive] = useState(false);

  // Escuchar eventos del perfil "Dislexia"
  useEffect(() => {
    const handleProfileDyslexia = (e) => {
      if (e.detail && typeof e.detail.active === "boolean") {
        setActive(e.detail.active);
      }
    };

    window.addEventListener("set-dyslexia", handleProfileDyslexia);
    return () => {
      window.removeEventListener("set-dyslexia", handleProfileDyslexia);
    };
  }, []);

  // Aplicar espaciado de letras amigable para dislexia en el body
  useEffect(() => {
    if (active) {
      document.body.setAttribute("data-dyslexia", "true");
    } else {
      document.body.removeAttribute("data-dyslexia");
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
      aria-label={`Dislexia amigable: ${active ? "activado" : "desactivado"}`}
      type="button"
    >
      {/* Icono: letras AZ con estilo */}
      <span className={styles.iconText}>AZ</span>

      <span className={styles.label}>Dislexia amigable</span>

      {/* Toggle switch visual */}
      <div className={styles.toggleTrack}>
        <div
          className={`${styles.toggleHandle} ${active ? styles.activeHandle : ""}`}
        />
      </div>
    </button>
  );
}
