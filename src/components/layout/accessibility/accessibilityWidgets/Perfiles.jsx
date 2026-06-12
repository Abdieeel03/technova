import { useState, useEffect } from "react";
import styles from "../../../../css_components/accessibility/Perfiles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCheck,
  faEyeSlash,
  faBrain,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

export default function Perfiles() {
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
      window.removeEventListener("lecture-mask-deactivated", handleMaskDeactivated);
    };
  }, []);

  const perfiles = [
    {
      id: 1,
      name: "Visión Baja",
      iconType: "icon",
      icon: faEyeSlash,
      caracteristicas: [{ TextSize: 4 }, { CursorSize: 2 }],
    },
    {
      id: 2,
      name: "Dislexia",
      iconType: "text",
      iconText: "∀?",
      caracteristicas: [{ Dislexia: true }, { TextSpacing: true }],
    },
    {
      id: 3,
      name: "TDHA",
      iconType: "icon",
      icon: faBrain,
      caracteristicas: [{ FocusMode: true }],
    },
    {
      id: 4,
      name: "Daltonismo",
      iconType: "icon",
      icon: faCircleHalfStroke,
      caracteristicas: [{ Daltonismo: true }],
    },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSelect = (id, name) => {
    let nextSelectedPerfil = "";
    let nextPerfilName = "";
    let nextActive = false;

    if (selectedPerfil === id && isActive) {
      // Si ya está seleccionado, se desactiva
      nextSelectedPerfil = "";
      nextPerfilName = "";
      nextActive = false;
    } else {
      // Si es diferente, se activa
      nextSelectedPerfil = id;
      nextPerfilName = name;
      nextActive = true;
    }

    setSelectedPerfil(nextSelectedPerfil);
    setPerfilName(nextPerfilName);
    setIsActive(nextActive);

    // Si el perfil de TDHA (id: 3) está activo, activamos la máscara de lectura
    const isTdhaActive = nextActive && nextSelectedPerfil === 3;
    window.dispatchEvent(
      new CustomEvent("toggle-lecture-mask", { detail: { active: isTdhaActive } })
    );
  };


  return (
    <section className={styles.dropdownContainer}>
      <div>
        <button onClick={toggleMenu} className={styles.dropdownButton}>
          <span>Perfil: {isActive ? `[${perfilName}], activo` : ""}</span>
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
