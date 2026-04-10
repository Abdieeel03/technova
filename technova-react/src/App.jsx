import { useState } from "react";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
