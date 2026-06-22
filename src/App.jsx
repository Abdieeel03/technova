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
import PoliticaCookies from "./pages/PoliticaCookies";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import Admin from "./pages/Admin";

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
          <Route path="/politica-cookies" element={<PoliticaCookies />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/admin" element={<Admin />} />
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
