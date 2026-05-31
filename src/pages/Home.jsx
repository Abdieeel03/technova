import Hero from "../components/home/Hero";
import PromoCarousel from "../components/home/PromoCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/home/BestSellers";
import BrandsCarousel from "../components/home/BrandsCarousel";
import CategoryCarousel from "../components/home/CategoryCarousel";

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
