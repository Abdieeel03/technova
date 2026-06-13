import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/LectureMask.module.css";

export default function LectureMask() {
  const [active, setActive] = useState(false);
  const [mouseY, setMouseY] = useState(window.innerHeight / 2);
  const maskHeight = 140; // Altura de la máscara de lectura en píxeles

  useEffect(() => {
    const handleToggle = (e) => {
      if (e.detail && typeof e.detail.active === "boolean") {
        setActive(e.detail.active);
      }
    };

    window.addEventListener("toggle-lecture-mask", handleToggle);
    return () => {
      window.removeEventListener("toggle-lecture-mask", handleToggle);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e) => {
      // Usar requestAnimationFrame para asegurar máxima suavidad (smooth)
      window.requestAnimationFrame(() => {
        setMouseY(e.clientY);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  const toggleMask = () => {
    const nextActive = !active;
    setActive(nextActive);
    if (!nextActive) {
      window.dispatchEvent(new CustomEvent("lecture-mask-deactivated"));
    }
  };

  const topHeight = Math.max(0, mouseY - maskHeight / 2);
  const bottomTop = mouseY + maskHeight / 2;

  return (
    <>
      {/* Botón renderizado dentro del grid del panel de accesibilidad */}
      <button
        onClick={toggleMask}
        className={`${styles.widgetButton} ${active ? styles.activeButton : ""}`}
        aria-pressed={active}
        type="button"
      >
        <svg viewBox="0 0 32 20" className={styles.iconSvg}>
          {/* Rectángulo de contorno */}
          <rect x="2" y="2" width="28" height="16" rx="2" />
          {/* Línea horizontal central (máscara de lectura) */}
          <line
            x1="2"
            y1="10"
            x2="30"
            y2="10"
            strokeDasharray="1, 0"
            strokeWidth="3"
          />
        </svg>
        <span className={styles.label}>Máscara de lectura</span>

        {/* Toggle switch visual */}
        <div className={styles.toggleTrack}>
          <div
            className={`${styles.toggleHandle} ${active ? styles.activeHandle : ""}`}
          />
        </div>
      </button>

      {/* Renderizado de los overlays oscuros si la máscara está activa */}
      {active && (
        <div className={styles.maskContainer}>
          <div
            className={styles.overlayTop}
            style={{ height: `${topHeight}px` }}
          />
          <div
            className={styles.overlayBottom}
            style={{ top: `${bottomTop}px` }}
          />
          <div className={styles.guideTop} style={{ top: `${topHeight}px` }} />
          <div
            className={styles.guideBottom}
            style={{ top: `${bottomTop}px` }}
          />
        </div>
      )}
    </>
  );
}
