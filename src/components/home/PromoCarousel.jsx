import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import styles from "../../css_components/PromoCarousel.module.css";
import { useLanguage } from "../../context/LanguageContext";

export default function PromoCarousel() {
  const { t } = useLanguage();
  const slides = [
    {
      id: 1,
      img: "Promo1.png",
      alt: t.promo.laptops,
      link: "/productos?categoria=laptops",
    },
    {
      id: 2,
      img: "Promo2.png",
      alt: t.promo.celulares,
      link: "/productos?categoria=celulares",
    },
    {
      id: 3,
      img: "Promo3.png",
      alt: t.promo.audifonos,
      link: "/productos?categoria=audio",
    },
  ];
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const goTo = useCallback(
    (idx) => setCurrent((idx + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <section className={styles.carousel}>
      <button
        className={`${styles.nav} ${styles.navLeft}`}
        onClick={() => goTo(current - 1)}
        aria-label={t.common.anterior}
      >
        &#8249;
      </button>

      <div
        className={styles.slide}
        onClick={() => navigate(slides[current].link)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(slides[current].link)}
      >
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.img}
            alt={s.alt}
            className={`${styles.img} ${i === current ? styles.active : ""}`}
          />
        ))}
      </div>

      <button
        className={`${styles.nav} ${styles.navRight}`}
        onClick={() => goTo(current + 1)}
        aria-label={t.common.siguiente}
      >
        &#8250;
      </button>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={t.promo.slideAria.replace("{n}", i + 1)}
          />
        ))}
      </div>
    </section>
  );
}
