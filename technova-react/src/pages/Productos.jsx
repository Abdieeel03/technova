import { useEffect, useState } from "react";
import data from "../data/productos.json";
import ProductCard from "../components/ProductCard";
import styles from "../css_components/Productos.module.css";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("todos");

  useEffect(() => {
    setProductos(data.productos);
  }, []);

  const productosFiltrados =
    categoria === "todos"
      ? productos
      : productos.filter(p => p.categoria === categoria);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Nuestros Productos</h1>
        <p>Descubre nuestra amplia gama</p>

        <select onChange={(e) => setCategoria(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="audio">Audio</option>
          <option value="accesorios">Accesorios</option>
          <option value="gaming">Gaming</option>
          <option value="camaras">Cámaras</option>
        </select>
      </div>

      <div className={styles.grid}>
        {productosFiltrados.map(p => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </main>
  );
}