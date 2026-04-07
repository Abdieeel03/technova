import { useState } from "react";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { Routes, Route } from "react-router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
