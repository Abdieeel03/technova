import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/TextSize.module.css";
import { useLanguage } from "../../../../context/LanguageContext";

const TEXT_SIZE_LEVELS = [
  { level: 1, fontSize: "16px" },
  { level: 2, fontSize: "18px" },
  { level: 3, fontSize: "20px" },
  { level: 4, fontSize: "22px" },
];

export default function TextSize() {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);

  // Escuchar eventos del perfil "Visión Baja"
  useEffect(() => {
    const handleProfileTextSize = (e) => {
      if (e.detail && typeof e.detail.level === "number") {
        setCurrentLevel(e.detail.level);
      }
    };

    window.addEventListener("set-text-size", handleProfileTextSize);
    return () => {
      window.removeEventListener("set-text-size", handleProfileTextSize);
    };
  }, []);

  // Aplicar el tamaño de fuente al html root
  useEffect(() => {
    const root = document.documentElement;
    const config = TEXT_SIZE_LEVELS.find((l) => l.level === currentLevel);
    if (config) {
      root.setAttribute("data-text-size", currentLevel);
      root.style.fontSize = config.fontSize;
    }

    return () => {
      // Limpiar solo si desmontamos
    };
  }, [currentLevel]);

  const cycleLevel = () => {
    setCurrentLevel((prev) => {
      const next = prev >= 4 ? 1 : prev + 1;
      return next;
    });
  };

  const isActive = currentLevel > 1;

  return (
    <button
      onClick={cycleLevel}
      className={`${styles.widgetButton} ${isActive ? styles.activeButton : ""}`}
      aria-label={t.accesibilidad.tamanoTextoAria.replace("{n}", currentLevel)}
      type="button"
    >
      {/* Icono: T pequeña + T grande */}
      <div className={styles.iconWrapper}>
        <span className={styles.iconSmallT}>T</span>
        <span className={styles.iconLargeT}>T</span>
      </div>

      <span className={styles.label}>{t.accesibilidad.tamanoTexto}</span>

      {/* Indicador de nivel con puntos */}
      <div className={styles.levelIndicator}>
        {TEXT_SIZE_LEVELS.map((lvl) => (
          <span
            key={lvl.level}
            className={`${styles.levelDot} ${
              lvl.level <= currentLevel ? styles.levelDotActive : ""
            }`}
          />
        ))}
      </div>
    </button>
  );
}
