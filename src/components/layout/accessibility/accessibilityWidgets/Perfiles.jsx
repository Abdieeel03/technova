import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/Perfiles.module.css";
import { useLanguage } from "../../../../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCheck,
  faEyeSlash,
  faBrain,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

// Función para despachar las características de un perfil
function dispatchProfileFeatures(caracteristicas, activate) {
  caracteristicas.forEach((caract) => {
    const key = Object.keys(caract)[0];
    const value = caract[key];

    switch (key) {
      case "TextSize":
        window.dispatchEvent(
          new CustomEvent("set-text-size", {
            detail: { level: activate ? value : 1 },
          }),
        );
        break;
      case "CursorSize":
        window.dispatchEvent(
          new CustomEvent("set-cursor-size", {
            detail: { large: activate ? value >= 2 : false },
          }),
        );
        break;
      case "Dislexia":
        window.dispatchEvent(
          new CustomEvent("set-dyslexia", {
            detail: { active: activate },
          }),
        );
        break;
      case "TextSpacing":
        window.dispatchEvent(
          new CustomEvent("set-text-spacing", {
            detail: { active: activate },
          }),
        );
        break;
      case "FocusMode":
        window.dispatchEvent(
          new CustomEvent("toggle-lecture-mask", {
            detail: { active: activate },
          }),
        );
        break;
      case "Daltonismo":
        window.dispatchEvent(
          new CustomEvent("set-daltonismo", {
            detail: { active: activate },
          }),
        );
        break;
      default:
        break;
    }
  });
}

// Resetear todos los widgets a su estado por defecto
function resetAllWidgets() {
  window.dispatchEvent(
    new CustomEvent("set-text-size", { detail: { level: 1 } }),
  );
  window.dispatchEvent(
    new CustomEvent("set-cursor-size", { detail: { large: false } }),
  );
  window.dispatchEvent(
    new CustomEvent("set-dyslexia", { detail: { active: false } }),
  );
  window.dispatchEvent(
    new CustomEvent("set-text-spacing", { detail: { active: false } }),
  );
  window.dispatchEvent(
    new CustomEvent("toggle-lecture-mask", { detail: { active: false } }),
  );
  window.dispatchEvent(
    new CustomEvent("set-daltonismo", { detail: { active: false } }),
  );
  window.dispatchEvent(
    new CustomEvent("set-tts", { detail: { active: false } }),
  );
}

export default function Perfiles() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState("");
  const [perfilName, setPerfilName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMaskDeactivated = () => {
      setSelectedPerfil((prev) => {
        if (prev === 3) {
          setPerfilName("");
          setIsActive(false);
          return "";
        }
        return prev;
      });
    };

    window.addEventListener("lecture-mask-deactivated", handleMaskDeactivated);
    return () => {
      window.removeEventListener(
        "lecture-mask-deactivated",
        handleMaskDeactivated,
      );
    };
  }, []);

  const perfiles = [
    {
      id: 1,
      name: t.accesibilidad.perfilVisionBaja,
      iconType: "icon",
      icon: faEyeSlash,
      caracteristicas: [{ TextSize: 4 }, { CursorSize: 2 }],
    },
    {
      id: 2,
      name: t.accesibilidad.perfilDislexia,
      iconType: "text",
      iconText: "∀?",
      caracteristicas: [{ Dislexia: true }, { TextSpacing: true }],
    },
    {
      id: 3,
      name: t.accesibilidad.perfilTDHA,
      iconType: "icon",
      icon: faBrain,
      caracteristicas: [{ FocusMode: true }],
    },
    {
      id: 4,
      name: t.accesibilidad.perfilDaltonismo,
      iconType: "icon",
      icon: faCircleHalfStroke,
      caracteristicas: [{ Daltonismo: true }],
    },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSelect = (id, name) => {
    const perfil = perfiles.find((p) => p.id === id);

    if (selectedPerfil === id && isActive) {
      // Desactivar el perfil actual
      if (perfil) {
        dispatchProfileFeatures(perfil.caracteristicas, false);
      }
      setSelectedPerfil("");
      setPerfilName("");
      setIsActive(false);
    } else {
      // Si hay un perfil activo, primero reseteamos todo
      if (isActive && selectedPerfil !== "") {
        resetAllWidgets();
      }

      // Activar el nuevo perfil
      setSelectedPerfil(id);
      setPerfilName(name);
      setIsActive(true);

      if (perfil) {
        // Pequeño delay para que los resets se apliquen primero
        setTimeout(() => {
          dispatchProfileFeatures(perfil.caracteristicas, true);
        }, 50);
      }
    }
  };

  return (
    <section className={styles.dropdownContainer}>
      <div>
        <button onClick={toggleMenu} className={styles.dropdownButton}>
          <span>
            {t.accesibilidad.perfil}:{" "}
            {isActive ? `[${perfilName}], ${t.accesibilidad.perfilActivo}` : ""}
          </span>
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className={styles.chevronIcon}
          />
        </button>
        <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}>
          <ul className={styles.languageList}>
            {perfiles.map((perfil) => (
              <li
                key={perfil.id}
                className={`${styles.languageItem} ${
                  selectedPerfil === perfil.id ? styles.active : ""
                }`}
                onClick={() => handleSelect(perfil.id, perfil.name)}
              >
                <div className={styles.languageInfo}>
                  <div className={styles.iconWrapper}>
                    {perfil.iconType === "icon" ? (
                      <FontAwesomeIcon icon={perfil.icon} />
                    ) : (
                      <span className={styles.dyslexiaIcon}>
                        {perfil.iconText}
                      </span>
                    )}
                  </div>
                  <span>{perfil.name}</span>
                </div>
                {selectedPerfil === perfil.id && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={styles.checkIcon}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
