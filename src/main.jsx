import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./css_components/general.css";
import App from "./App.jsx";
import CarritoProvider from "./provider/CarritoProvider";
import AuthProvider from "./auth/provider/AuthProvider";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>,
);
