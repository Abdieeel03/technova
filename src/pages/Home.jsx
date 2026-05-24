import Hero from "../components/ui/Hero";
import PromoCarousel from "../components/ui/PromoCarousel";
import FeaturedProducts from "../components/ui/FeaturedProducts";
import BrandsCarousel from "../components/ui/BrandsCarousel";
import CategoryCarousel from "../components/ui/CategoryCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryCarousel tipo="pantalla" titulo="🖥️ Pantallas" />
      <CategoryCarousel tipo="mouse" titulo="🖱️ Mouse" />
      <CategoryCarousel tipo="audífonos" titulo="🎧 Audífonos" />
      <BrandsCarousel />
      <PromoCarousel />
    </>
  );
}
