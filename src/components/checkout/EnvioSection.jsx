import { useEffect } from "react";
import styles from "../../css_components/Checkout.module.css";

/**
 * Placeholder para el sistema de envíos.
 *
 * Props:
 *   - onEnvioChange(info): Llamar cuando cambie la selección de envío.
 *     info = { metodo: string, costoEnvio: number, direccion: object | null }
 *   - items: Array de items del carrito (para calcular peso/tamaño si lo necesita).
 *   - userId: ID del usuario autenticado.
 *
 * INSTRUCCIONES PARA EL COMPAÑERO:
 * 1. Reemplazar este componente con tu implementación.
 * 2. Mantener la misma interfaz de props (onEnvioChange, items, userId).
 * 3. Llamar onEnvioChange() cada vez que el usuario cambie el método de envío.
 * 4. Puedes crear tus propios endpoints en api/envios/ para calcular costos.
 * 5. NO modificar: procesar-pago.js, FormularioPago.jsx, checkoutApi.js
 */
export default function EnvioSection({ onEnvioChange, items, userId }) {
  useEffect(() => {
    // Default: envío estándar gratuito
    onEnvioChange({ metodo: "standard", costoEnvio: 0, direccion: null });
  }, []);

  return (
    <section className={styles.envioSection}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>📦</span>
        Metodo de Envio
      </h3>
      <div className={styles.envioPlaceholder}>
        <div className={styles.envioOption}>
          <div className={styles.envioRadio}>
            <span className={styles.envioRadioActive} />
          </div>
          <div className={styles.envioDetails}>
            <p className={styles.envioLabel}>Envio estandar</p>
            <p className={styles.envioDesc}>Entrega en 5-7 dias habiles</p>
          </div>
          <span className={styles.envioCost}>Gratis</span>
        </div>
      </div>
    </section>
  );
}
