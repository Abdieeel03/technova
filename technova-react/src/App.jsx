import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";

function App() {
  return (
    <>
      <Header />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
