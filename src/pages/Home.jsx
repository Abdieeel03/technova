import Hero from "../components/home/Hero";
import PromoCarousel from "../components/home/PromoCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/home/BestSellers";
import BrandsCarousel from "../components/home/BrandsCarousel";
import CategoryCarousel from "../components/home/CategoryCarousel";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BestSellers />
      <CategoryCarousel tipo="pantalla" titulo={t.home.pantallas} />
      <CategoryCarousel tipo="mouse" titulo={t.home.mouse} />
      <CategoryCarousel tipo="audífonos" titulo={t.home.audifonos} />
      <BrandsCarousel />
      <PromoCarousel />
    </>
  );
}
