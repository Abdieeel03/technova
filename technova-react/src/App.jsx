import { useState } from "react";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default App;
