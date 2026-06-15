import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../../css_components/accessibility/Lenguague.module.css";

export default function Lenguague() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("es");

  const toggleMenu = () => setIsOpen(!isOpen);

  {
    /* Aun no se implementara la traduccion */
  }

  const languages = [
    {
      code: "es",
      name: "Español",
      flag: "https://flagcdn.com/w40/pe.png",
      alt: "Bandera de Perú",
    },
    {
      code: "en",
      name: "Inglés",
      flag: "https://flagcdn.com/w40/us.png",
      alt: "Bandera de USA",
    },
  ];

  const handleSelect = (code) => {
    setSelectedLanguage(code);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === selectedLanguage);

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={toggleMenu} className={styles.dropdownButton}>
        <span>Idioma: {currentLang.name}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${styles.chevronIcon} ${isOpen ? styles.open : ""}`}
        />
      </button>

      <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}>
        <ul className={styles.languageList}>
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`${styles.languageItem} ${selectedLanguage === lang.code ? styles.active : ""}`}
              onClick={() => handleSelect(lang.code)}
            >
              <div className={styles.languageInfo}>
                <img
                  src={lang.flag}
                  alt={lang.alt}
                  className={styles.flagIcon}
                />
                <span>{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && (
                <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
