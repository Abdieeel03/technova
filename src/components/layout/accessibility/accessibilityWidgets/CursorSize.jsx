import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/CursorSize.module.css";
import { useLanguage } from "../../../../context/LanguageContext";

export default function CursorSize() {
  const { t } = useLanguage();
  const [isLarge, setIsLarge] = useState(false);

  // Escuchar eventos del perfil "Visión Baja"
  useEffect(() => {
    const handleProfileCursor = (e) => {
      if (e.detail && typeof e.detail.large === "boolean") {
        setIsLarge(e.detail.large);
      }
    };

    window.addEventListener("set-cursor-size", handleProfileCursor);
    return () => {
      window.removeEventListener("set-cursor-size", handleProfileCursor);
    };
  }, []);

  // Aplicar el tamaño de cursor en el body
  useEffect(() => {
    if (isLarge) {
      document.body.setAttribute("data-cursor-size", "large");
    } else {
      document.body.removeAttribute("data-cursor-size");
    }
  }, [isLarge]);

  const toggleCursor = () => {
    setIsLarge((prev) => !prev);
  };

  return (
    <button
      onClick={toggleCursor}
      className={`${styles.widgetButton} ${isLarge ? styles.activeButton : ""}`}
      aria-pressed={isLarge}
      aria-label={`${t.accesibilidad.cursor}: ${isLarge ? t.accesibilidad.cursorAriaGrande : t.accesibilidad.cursorAriaNormal}`}
      type="button"
    >
      {/* Icono: cursor flecha */}
      <svg viewBox="0 0 24 24" className={styles.iconSvg}>
        <path
          d="M6 3l12 13h-7.5l3.5 7-2.5 1-3.5-7L4 21V3h2z"
          fill={isLarge ? "#1a73e8" : "var(--color-text)"}
          stroke="none"
        />
      </svg>

      <span className={styles.label}>{t.accesibilidad.cursor}</span>

      {/* Toggle switch visual */}
      <div className={styles.toggleTrack}>
        <div
          className={`${styles.toggleHandle} ${isLarge ? styles.activeHandle : ""}`}
        />
      </div>
    </button>
  );
}
