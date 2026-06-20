import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../../../../css_components/accessibility/TextToSpeech.module.css";

export default function TextToSpeech() {
  const [active, setActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  // Escuchar eventos del sistema de perfiles / reset
  useEffect(() => {
    const handleProfileTTS = (e) => {
      if (e.detail && typeof e.detail.active === "boolean") {
        setActive(e.detail.active);
      }
    };

    window.addEventListener("set-tts", handleProfileTTS);
    return () => {
      window.removeEventListener("set-tts", handleProfileTTS);
    };
  }, []);

  // Detener la voz cuando se desactiva el widget
  useEffect(() => {
    if (!active) {
      window.speechSynthesis.cancel();
      window.setTimeout(() => setIsSpeaking(false), 0);
    }
  }, [active]);

  // Función para leer el texto seleccionado
  const leerTextoSeleccionado = useCallback(() => {
    const texto = window.getSelection().toString().trim();

    if (!texto) return;

    // Cancelar cualquier lectura previa
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-ES";

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);

    utteranceRef.current = speech;
    window.speechSynthesis.speak(speech);
  }, []);

  // Detener la lectura
  const detenerLectura = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Registrar/eliminar listener de mouseup y Escape
  useEffect(() => {
    if (!active) return;

    const handleMouseUp = () => {
      // Pequeño delay para que getSelection() capture bien la selección
      setTimeout(leerTextoSeleccionado, 10);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSpeaking) {
        detenerLectura();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, isSpeaking, leerTextoSeleccionado, detenerLectura]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggle = () => {
    setActive((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggle}
        className={`${styles.widgetButton} ${active ? styles.activeButton : ""}`}
        aria-pressed={active}
        aria-label={`Lector de voz: ${active ? "activado" : "desactivado"}`}
        type="button"
      >
        {/* Icono: altavoz / megáfono */}
        <svg viewBox="0 0 24 24" className={styles.iconSvg}>
          <path
            d="M11 5L6 9H2v6h4l5 4V5z"
            fill="none"
            stroke="var(--color-text)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {active && (
            <>
              <path
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
                fill="none"
                stroke="var(--color-text)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.07 4.93a10 10 0 0 1 0 14.14"
                fill="none"
                stroke="var(--color-text)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>

        <span className={styles.label}>Lector de Voz</span>

        {/* Toggle switch visual */}
        <div className={styles.toggleTrack}>
          <div
            className={`${styles.toggleHandle} ${active ? styles.activeHandle : ""}`}
          />
        </div>
      </button>

      {/* Botón flotante de control — se renderiza via Portal al body */}
      {isSpeaking &&
        createPortal(
          <button
            className={styles.floatingControl}
            onClick={detenerLectura}
            aria-label="Detener lectura de voz"
            type="button"
          >
            {/* Indicador animado de ondas de sonido */}
            <span className={styles.soundWaves}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className={styles.stopLabel}>Detener ⏹</span>
          </button>,
          document.body,
        )}
    </>
  );
}
