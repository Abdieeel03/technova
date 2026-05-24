import { useState, useEffect, useRef } from "react";
import styles from "../../css_components/BrandsCarousel.module.css";

const brands = [
  { id: 1, name: "MSI", logo: "/img/brands/msilogo.png" },
  { id: 2, name: "Xiaomi", logo: "/img/brands/xiaomilogo.png" },
  { id: 3, name: "Teclast", logo: "/img/brands/teclastlogo.png" },
  { id: 4, name: "AMD", logo: "/img/brands/amdlogo.jpg" },
  { id: 5, name: "ASRock", logo: "/img/brands/asrocklogo.png" },
  { id: 6, name: "Hyperx", logo: "/img/brands/hyperxlogo.png" },
  { id: 7, name: "ASUS", logo: "/img/brands/asuslogo.png" },
  { id: 8, name: "Kingston", logo: "/img/brands/kingstonlogo.png" },
  { id: 9, name: "Corsair", logo: "/img/brands/corsairlogo.png" },
  { id: 10, name: "Logitech", logo: "/img/brands/logitechlogo.png" },
  { id: 11, name: "Razer", logo: "/img/brands/razerlogo.png" },
  { id: 12, name: "Intel", logo: "/img/brands/intellogo.png" },
];

const VISIBLE = 6;
const TOTAL_PAGES = Math.ceil(brands.length / VISIBLE);

export default function BrandsCarousel() {
  const [page, setPage] = useState(0);
  const intervalRef = useRef(null);

  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const next = () => setPage((p) => Math.min(p + 1, TOTAL_PAGES - 1));

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setPage((p) => (p + 1) % TOTAL_PAGES);
    }, 4000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, []);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    startAutoPlay();
  };

  const visibles = brands.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.carouselWrapper}>
          <button
            className={styles.arrow}
            onClick={() => {
              prev();
              resetTimer();
            }}
            disabled={page === 0}
            aria-label="Anterior"
          >
            &#8249;
          </button>

          <div className={styles.track}>
            {visibles.map((brand) => (
              <div key={brand.id} className={styles.card}>
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className={styles.logo}
                />
              </div>
            ))}
          </div>

          <button
            className={styles.arrow}
            onClick={() => {
              next();
              resetTimer();
            }}
            disabled={page === TOTAL_PAGES - 1}
            aria-label="Siguiente"
          >
            &#8250;
          </button>
        </div>

        <div className={styles.dots}>
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === page ? styles.dotActive : ""}`}
              onClick={() => {
                setPage(i);
                resetTimer();
              }}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
