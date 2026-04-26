import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import InfoPage from "./pages/InfoPage";
import NotFound from "./pages/NotFound";

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
          <Route
            path="/politica-cookies"
            element={
              <InfoPage
                title="Politica de cookies"
                description="Estamos preparando esta seccion para explicar como usamos cookies y mejorar tu experiencia en el sitio."
              />
            }
          />
          <Route
            path="/politica-privacidad"
            element={
              <InfoPage
                title="Politica de privacidad"
                description="Aqui publicaremos de forma clara como protegemos tus datos personales y como puedes ejercer tus derechos."
              />
            }
          />
          <Route
            path="/terminos-condiciones"
            element={
              <InfoPage
                title="Terminos y condiciones"
                description="Pronto encontraras en esta pagina las condiciones de uso, compra y garantias de TechNova."
              />
            }
          />
          <Route
            path="/inicia-sesion"
            element={<Navigate to="/?modal=login" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
