import { useEffect, useMemo, useState } from "react";
import styles from "../../css_components/Checkout.module.css";

/**
 * Sistema de envíos.
 *
 * Props:
 *   - onEnvioChange(info): Llamado cuando cambia la selección de envío.
 *     info = {
 *       metodo: "standard" | "pickup",
 *       costoEnvio: number,
 *       direccion: {
 *         nombreReceptor, telefono, zona, ciudad, distrito, direccion, referencia
 *       } | null,
 *       valido: boolean,  // false mientras falten datos obligatorios
 *     }
 *   - items: Array de items del carrito.
 *   - userId: ID del usuario autenticado.
 *
 * NO modifica: procesar-pago.js, FormularioPago.jsx, checkoutApi.js
 */

const COSTOS = {
  lima: 15,
  provincia: 30,
};

const TIENDA_DIRECCION = "Av. Larco 345, Miraflores, Lima";

const INITIAL_DIRECCION = {
  nombreReceptor: "",
  telefono: "",
  zona: "lima", // "lima" | "provincia"
  ciudad: "",
  distrito: "",
  direccion: "",
  referencia: "",
};

const INITIAL_ERRORS = {
  nombreReceptor: "",
  telefono: "",
  ciudad: "",
  distrito: "",
  direccion: "",
};

const validateField = (field, value, zona) => {
  switch (field) {
    case "nombreReceptor":
      if (!value.trim()) return "Ingresa el nombre de quien recibe.";
      if (value.trim().length < 3) return "Nombre muy corto.";
      return "";
    case "telefono": {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 0) return "Ingresa un telefono de contacto.";
      if (digits.length !== 9) return "El telefono debe tener 9 digitos.";
      return "";
    }
    case "ciudad":
      if (zona === "provincia" && !value.trim()) {
        return "Ingresa la ciudad.";
      }
      return "";
    case "distrito":
      if (!value.trim()) return "Ingresa el distrito.";
      return "";
    case "direccion":
      if (!value.trim()) return "Ingresa la direccion completa.";
      if (value.trim().length < 6) return "Direccion muy corta.";
      return "";
    default:
      return "";
  }
};

export default function EnvioSection({ onEnvioChange }) {
  const [metodo, setMetodo] = useState("standard");
  const [direccion, setDireccion] = useState(INITIAL_DIRECCION);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});

  const costoEnvio = useMemo(() => {
    if (metodo === "pickup") return 0;
    return COSTOS[direccion.zona] ?? COSTOS.lima;
  }, [metodo, direccion.zona]);

  const isDireccionValida = useMemo(() => {
    if (metodo === "pickup") return true;
    const fields = ["nombreReceptor", "telefono", "distrito", "direccion"];
    const allFields =
      direccion.zona === "provincia" ? [...fields, "ciudad"] : fields;
    return allFields.every(
      (f) => !validateField(f, direccion[f], direccion.zona),
    );
  }, [metodo, direccion]);

  useEffect(() => {
    onEnvioChange({
      metodo,
      costoEnvio,
      direccion: metodo === "pickup" ? null : direccion,
      valido: isDireccionValida,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodo, costoEnvio, direccion, isDireccionValida]);

  const handleChange = (field, value) => {
    setDireccion((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value, direccion.zona),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, direccion[field], direccion.zona),
    }));
  };

  const handleZonaChange = (zona) => {
    setDireccion((prev) => ({ ...prev, zona }));
    if (touched.ciudad) {
      setErrors((prev) => ({
        ...prev,
        ciudad: validateField("ciudad", direccion.ciudad, zona),
      }));
    }
  };

  return (
    <section className={styles.envioSection}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>📦</span>
        Metodo de Envio
      </h3>

      <div className={styles.envioPlaceholder}>
        <button
          type="button"
          className={styles.envioOption}
          style={
            metodo !== "standard"
              ? { borderColor: "#d1d5db", background: "transparent" }
              : undefined
          }
          onClick={() => setMetodo("standard")}
        >
          <div className={styles.envioRadio}>
            {metodo === "standard" ? (
              <span className={styles.envioRadioActive} />
            ) : null}
          </div>
          <div className={styles.envioDetails}>
            <p className={styles.envioLabel}>Envio estandar</p>
            <p className={styles.envioDesc}>
              Entrega en 5-7 dias habiles a tu domicilio
            </p>
          </div>
          <span className={styles.envioCost}>
            S/.{" "}
            {COSTOS[
              direccion.zona === "provincia" ? "provincia" : "lima"
            ].toFixed(2)}
          </span>
        </button>

        <button
          type="button"
          className={styles.envioOption}
          style={
            metodo !== "pickup"
              ? { borderColor: "#d1d5db", background: "transparent" }
              : undefined
          }
          onClick={() => setMetodo("pickup")}
        >
          <div className={styles.envioRadio}>
            {metodo === "pickup" ? (
              <span className={styles.envioRadioActive} />
            ) : null}
          </div>
          <div className={styles.envioDetails}>
            <p className={styles.envioLabel}>Recojo en tienda</p>
            <p className={styles.envioDesc}>{TIENDA_DIRECCION}</p>
          </div>
          <span className={styles.envioCost}>Gratis</span>
        </button>
      </div>

      {metodo === "standard" ? (
        <div
          className={styles.cardForm}
          style={{ marginTop: "var(--space-5)" }}
        >
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="envio-zona" className={styles.fieldLabel}>
                Zona de entrega
              </label>
              <select
                id="envio-zona"
                className={styles.fieldInput}
                value={direccion.zona}
                onChange={(e) => handleZonaChange(e.target.value)}
              >
                <option value="lima">Lima Metropolitana — S/. 15.00</option>
                <option value="provincia">Provincia — S/. 30.00</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="envio-telefono" className={styles.fieldLabel}>
                Telefono de contacto
              </label>
              <input
                id="envio-telefono"
                type="text"
                inputMode="numeric"
                className={`${styles.fieldInput} ${errors.telefono && touched.telefono ? styles.fieldError : ""}`}
                placeholder="987654321"
                value={direccion.telefono}
                onChange={(e) =>
                  handleChange(
                    "telefono",
                    e.target.value.replace(/\D/g, "").slice(0, 9),
                  )
                }
                onBlur={() => handleBlur("telefono")}
              />
              {errors.telefono && touched.telefono ? (
                <p className={styles.errorMsg}>{errors.telefono}</p>
              ) : null}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="envio-nombre" className={styles.fieldLabel}>
              Nombre de quien recibe
            </label>
            <input
              id="envio-nombre"
              type="text"
              className={`${styles.fieldInput} ${errors.nombreReceptor && touched.nombreReceptor ? styles.fieldError : ""}`}
              placeholder="Nombre completo"
              value={direccion.nombreReceptor}
              onChange={(e) => handleChange("nombreReceptor", e.target.value)}
              onBlur={() => handleBlur("nombreReceptor")}
            />
            {errors.nombreReceptor && touched.nombreReceptor ? (
              <p className={styles.errorMsg}>{errors.nombreReceptor}</p>
            ) : null}
          </div>

          <div className={styles.fieldRow}>
            {direccion.zona === "provincia" ? (
              <div className={styles.fieldGroup}>
                <label htmlFor="envio-ciudad" className={styles.fieldLabel}>
                  Ciudad
                </label>
                <input
                  id="envio-ciudad"
                  type="text"
                  className={`${styles.fieldInput} ${errors.ciudad && touched.ciudad ? styles.fieldError : ""}`}
                  placeholder="Arequipa, Trujillo, etc."
                  value={direccion.ciudad}
                  onChange={(e) => handleChange("ciudad", e.target.value)}
                  onBlur={() => handleBlur("ciudad")}
                />
                {errors.ciudad && touched.ciudad ? (
                  <p className={styles.errorMsg}>{errors.ciudad}</p>
                ) : null}
              </div>
            ) : null}

            <div className={styles.fieldGroup}>
              <label htmlFor="envio-distrito" className={styles.fieldLabel}>
                Distrito
              </label>
              <input
                id="envio-distrito"
                type="text"
                className={`${styles.fieldInput} ${errors.distrito && touched.distrito ? styles.fieldError : ""}`}
                placeholder="Miraflores, San Isidro, etc."
                value={direccion.distrito}
                onChange={(e) => handleChange("distrito", e.target.value)}
                onBlur={() => handleBlur("distrito")}
              />
              {errors.distrito && touched.distrito ? (
                <p className={styles.errorMsg}>{errors.distrito}</p>
              ) : null}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="envio-direccion" className={styles.fieldLabel}>
              Direccion
            </label>
            <input
              id="envio-direccion"
              type="text"
              className={`${styles.fieldInput} ${errors.direccion && touched.direccion ? styles.fieldError : ""}`}
              placeholder="Calle, numero, depto."
              value={direccion.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              onBlur={() => handleBlur("direccion")}
            />
            {errors.direccion && touched.direccion ? (
              <p className={styles.errorMsg}>{errors.direccion}</p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="envio-referencia" className={styles.fieldLabel}>
              Referencia (opcional)
            </label>
            <input
              id="envio-referencia"
              type="text"
              className={styles.fieldInput}
              placeholder="Frente al parque, portón azul, etc."
              value={direccion.referencia}
              onChange={(e) => handleChange("referencia", e.target.value)}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
