import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import InfoPage from "./pages/InfoPage";
import MisCompras from "./pages/MisCompras";
import Checkout from "./pages/Checkout";
import CheckoutExito from "./pages/CheckoutExito";
import CheckoutCancelado from "./pages/CheckoutCancelado";
import NotFound from "./pages/NotFound";
import AccessibilityWidget from "./components/layout/accessibility/AccessibilityWidget";
import LectureMask from "./components/layout/accessibility/accessibilityWidgets/LectureMask";
import TextSize from "./components/layout/accessibility/accessibilityWidgets/TextSize";
import CursorSize from "./components/layout/accessibility/accessibilityWidgets/CursorSize";
import DyslexiaFriendly from "./components/layout/accessibility/accessibilityWidgets/DyslexiaFriendly";
import TextSpacing from "./components/layout/accessibility/accessibilityWidgets/TextSpacing";
import Daltonismo from "./components/layout/accessibility/accessibilityWidgets/Daltonismo";
import TextToSpeech from "./components/layout/accessibility/accessibilityWidgets/TextToSpeech";

function App() {
  return (
    <>
      <Header />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/mis-compras" element={<MisCompras />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/exito" element={<CheckoutExito />} />
          <Route path="/checkout/cancelado" element={<CheckoutCancelado />} />
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
      <AccessibilityWidget>
        {/* Aqui colocar sus componentes */}
        <TextSize />
        <Daltonismo />
        <CursorSize />
        <LectureMask />
        <DyslexiaFriendly />
        <TextSpacing />
        <TextToSpeech />
      </AccessibilityWidget>
      <Footer />
    </>
  );
}

export default App;
