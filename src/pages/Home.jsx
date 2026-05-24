import Hero from "../components/home/Hero";
import PromoCarousel from "../components/home/PromoCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/ui/BestSellers";
import BrandsCarousel from "../components/ui/BrandsCarousel";
import CategoryCarousel from "../components/ui/CategoryCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BestSellers />
      <CategoryCarousel tipo="pantalla" titulo="🖥️ Pantallas" />
      <CategoryCarousel tipo="mouse" titulo="🖱️ Mouse" />
      <CategoryCarousel tipo="audífonos" titulo="🎧 Audífonos" />
      <BrandsCarousel />
      <PromoCarousel />
    </>
  );
}
