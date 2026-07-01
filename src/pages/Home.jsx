import { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import PromoCarousel from "../components/home/PromoCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/home/BestSellers";
import BrandsCarousel from "../components/home/BrandsCarousel";
import CategoryCarousel from "../components/home/CategoryCarousel";
import { fetchProductos } from "../services/productosApi";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [productos, setProductos] = useState([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(true);
  const [productosError, setProductosError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchProductos(undefined, controller.signal)
      .then((productosData) => {
        setProductos(productosData);
        setProductosError(null);
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setProductosError(t.home.errorProductos);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingProductos(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <Hero />
      <FeaturedProducts
        productos={productos.slice(0, 12)}
        isLoading={isLoadingProductos}
        error={productosError && t.home.errorDestacados}
      />
      <BestSellers
        productos={productos.filter((producto) => producto.masVendido)}
        isLoading={isLoadingProductos}
        error={productosError && t.home.errorMasVendidos}
      />
      <CategoryCarousel
        tipo="monitor"
        icono="🖥️"
        titulo={t.home.tituloPantallas}
        productos={productos.filter(
          (producto) =>
            producto.tipo?.toLowerCase().includes("monitor") ||
            producto.tipo?.toLowerCase().includes("pantalla"),
        )}
        isLoading={isLoadingProductos}
        error={productosError && t.home.errorCategoria}
      />
      <CategoryCarousel
        tipo="mouse"
        icono="🖱️"
        titulo={t.home.tituloMouse}
        productos={productos.filter((producto) => producto.tipo === "mouse")}
        isLoading={isLoadingProductos}
        error={productosError && t.home.errorCategoria}
      />
      <CategoryCarousel
        tipo="audífonos"
        icono="🎧"
        titulo={t.home.tituloAudifonos}
        productos={productos.filter(
          (producto) =>
            producto.tipo?.toLowerCase().includes("audifono") ||
            producto.tipo?.toLowerCase().includes("audífono") ||
            producto.tipo?.toLowerCase().includes("auricular"),
        )}
        isLoading={isLoadingProductos}
        error={productosError && t.home.errorCategoria}
      />
      <BrandsCarousel />
      <PromoCarousel />
    </>
  );
}
