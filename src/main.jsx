import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./css_components/general.css";
import App from "./App.jsx";
import { CarritoProvider } from "./context/CarritoContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </BrowserRouter>,
);
