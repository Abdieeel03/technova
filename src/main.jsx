import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./css_components/general.css";
import App from "./App.jsx";
import CarritoProvider from "./provider/CarritoProvider";
import AuthProvider from "./auth/provider/AuthProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </AuthProvider>
  </BrowserRouter>,
);
