import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/TextSpacing.module.css";
import { useLanguage } from "../../../../context/LanguageContext";

const SPACING_LEVELS = [1, 2, 3];

export default function TextSpacing() {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);

  // Escuchar eventos del perfil "Dislexia"
  useEffect(() => {
    const handleProfileSpacing = (e) => {
      if (e.detail && typeof e.detail.active === "boolean") {
        setCurrentLevel(e.detail.active ? 2 : 1);
      }
      if (e.detail && typeof e.detail.level === "number") {
        setCurrentLevel(e.detail.level);
      }
    };

    window.addEventListener("set-text-spacing", handleProfileSpacing);
    return () => {
      window.removeEventListener("set-text-spacing", handleProfileSpacing);
    };
  }, []);

  // Aplicar interlineado en el body
  useEffect(() => {
    if (currentLevel === 1) {
      document.body.removeAttribute("data-text-spacing");
    } else {
      document.body.setAttribute("data-text-spacing", String(currentLevel));
    }
  }, [currentLevel]);

  const cycleLevel = () => {
    setCurrentLevel((prev) => (prev >= 3 ? 1 : prev + 1));
  };

  const isActive = currentLevel > 1;

  return (
    <button
      onClick={cycleLevel}
      className={`${styles.widgetButton} ${isActive ? styles.activeButton : ""}`}
      aria-label={t.accesibilidad.interlineadoAria.replace("{n}", currentLevel)}
      type="button"
    >
      {/* Icono SVG: líneas horizontales con espaciado */}
      <svg viewBox="0 0 24 24" className={styles.iconSvg}>
        {/* Tres líneas horizontales */}
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        {/* Flechas verticales de espaciado */}
        <path d="M2 8 L2 10" />
        <path d="M2 14 L2 16" />
        <path d="M22 8 L22 10" />
        <path d="M22 14 L22 16" />
      </svg>

      <span className={styles.label}>{t.accesibilidad.interlineado}</span>

      {/* Indicador de nivel con puntos */}
      <div className={styles.levelIndicator}>
        {SPACING_LEVELS.map((lvl) => (
          <span
            key={lvl}
            className={`${styles.levelDot} ${
              lvl <= currentLevel ? styles.levelDotActive : ""
            }`}
          />
        ))}
      </div>
    </button>
  );
}
