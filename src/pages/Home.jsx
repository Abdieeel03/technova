import Hero from "../components/ui/Hero";
import PromoCarousel from "../components/ui/PromoCarousel";
import FeaturedProducts from "../components/ui/FeaturedProducts";
import BrandsCarousel from "../components/ui/BrandsCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BrandsCarousel />
      <PromoCarousel />
    </>
  );
}
