import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../../css_components/accessibility/Lenguague.module.css";
import { useLanguage } from "../../../../context/LanguageContext";

export default function Lenguague() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  const languages = [
    {
      code: "es",
      name: "Español",
      flag: "https://flagcdn.com/w40/pe.png",
      alt: "Bandera de Perú",
    },
    {
      code: "en",
      name: "English",
      flag: "https://flagcdn.com/w40/us.png",
      alt: "USA Flag",
    },
    {
      code: "qu",
      name: "Quechua",
      flag: "https://flagcdn.com/w40/pe.png",
      alt: "Bandera de Perú (Quechua)",
      nativeName: "Runasimi",
    },
  ];

  const handleSelect = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === lang);

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={toggleMenu} className={styles.dropdownButton}>
        <span className={styles.buttonLabel}>
          <span className={styles.labelBold}>{t.accesibilidad.idioma}:</span>
          <span className={styles.labelValue}>{currentLang.name}</span>
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${styles.chevronIcon} ${isOpen ? styles.open : ""}`}
        />
      </button>

      <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}>
        <ul className={styles.languageList}>
          {languages.map((language) => (
            <li
              key={language.code}
              className={`${styles.languageItem} ${lang === language.code ? styles.active : ""}`}
              onClick={() => handleSelect(language.code)}
            >
              <div className={styles.languageInfo}>
                <img
                  src={language.flag}
                  alt={language.alt}
                  className={styles.flagIcon}
                />
                <div className={styles.languageNames}>
                  <span>{language.name}</span>
                  {language.nativeName && (
                    <span className={styles.nativeName}>
                      {language.nativeName}
                    </span>
                  )}
                </div>
              </div>
              {lang === language.code && (
                <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
