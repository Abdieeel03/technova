import { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import PromoCarousel from "../components/home/PromoCarousel";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BestSellers from "../components/home/BestSellers";
import BrandsCarousel from "../components/home/BrandsCarousel";
import CategoryCarousel from "../components/home/CategoryCarousel";
import { fetchProductos } from "../services/productosApi";

export default function Home() {
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
          setProductosError("No se pudieron cargar los productos.");
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
        error={productosError && "No se pudieron cargar los productos destacados."}
      />
      <BestSellers
        productos={productos.filter((producto) => producto.masVendido)}
        isLoading={isLoadingProductos}
        error={productosError && "No se pudieron cargar los más vendidos."}
      />
      <CategoryCarousel
        tipo="pantalla"
        titulo="🖥️ Pantallas"
        productos={productos.filter((producto) => producto.tipo === "pantalla")}
        isLoading={isLoadingProductos}
        error={productosError && "No se pudieron cargar estos productos."}
      />
      <CategoryCarousel
        tipo="mouse"
        titulo="🖱️ Mouse"
        productos={productos.filter((producto) => producto.tipo === "mouse")}
        isLoading={isLoadingProductos}
        error={productosError && "No se pudieron cargar estos productos."}
      />
      <CategoryCarousel
        tipo="audífonos"
        titulo="🎧 Audífonos"
        productos={productos.filter((producto) => producto.tipo === "audífonos")}
        isLoading={isLoadingProductos}
        error={productosError && "No se pudieron cargar estos productos."}
      />
      <BrandsCarousel />
      <PromoCarousel />
    </>
  );
}
