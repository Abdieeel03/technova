import { useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "../css_components/Checkout.module.css";
import useCarrito from "../hooks/useCarrito";
import useAuth from "../auth/hooks/useAuth";
import ResumenOrden from "../components/checkout/ResumenOrden";
import EnvioSection from "../components/checkout/EnvioSection";
import FormularioPago from "../components/checkout/FormularioPago";
import { procesarPago } from "../services/checkoutApi";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCarrito();
  const navigate = useNavigate();

  const [envioInfo, setEnvioInfo] = useState({
    metodo: "standard",
    costoEnvio: 0,
    direccion: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagoError, setPagoError] = useState(null);

  const handleEnvioChange = useCallback((info) => {
    setEnvioInfo(info);
  }, []);

  const handlePago = async (datosPago) => {
    setIsProcessing(true);
    setPagoError(null);

    const result = await procesarPago({
      userId: user.id,
      items,
      subtotal: totalPrice,
      pago: datosPago,
      envio: envioInfo,
    });

    setIsProcessing(false);

    if (!result.ok) {
      setPagoError(result.error);
      return;
    }

    clearCart();
    navigate(`/checkout/exito?orderId=${result.orden.id}`);
  };

  if (!user) {
    return <Navigate to="/?modal=login" replace />;
  }

  if (items.length === 0 && !isProcessing) {
    return <Navigate to="/productos" replace />;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1>Checkout</h1>
          <p>Completa tu compra de forma segura</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.mainCol}>
            <EnvioSection
              onEnvioChange={handleEnvioChange}
              items={items}
              userId={user.id}
            />

            <FormularioPago
              onSubmit={handlePago}
              isProcessing={isProcessing}
            />

            {pagoError ? (
              <div className={styles.pagoAlert} role="alert">
                <span className={styles.alertIcon}>⚠️</span>
                {pagoError}
              </div>
            ) : null}
          </div>

          <div className={styles.sideCol}>
            <ResumenOrden
              items={items}
              subtotal={totalPrice}
              costoEnvio={envioInfo.costoEnvio}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
