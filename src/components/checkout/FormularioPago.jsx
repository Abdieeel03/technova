import { useState } from "react";
import styles from "../../css_components/Checkout.module.css";

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

const isValidLuhn = (number) => {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) {
        n -= 9;
      }
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
};

const isExpiryValid = (expiry) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const expDate = new Date(year, month);
  return expDate > now;
};

const getCardBrand = (number) => {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("4")) {
    return "visa";
  }
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) {
    return "mastercard";
  }
  if (digits.startsWith("3")) {
    return "amex";
  }
  return null;
};

const INITIAL_FORM = {
  cardNumber: "",
  titular: "",
  expiry: "",
  cvv: "",
};

const INITIAL_ERRORS = {
  cardNumber: "",
  titular: "",
  expiry: "",
  cvv: "",
};

export default function FormularioPago({ onSubmit, isProcessing }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});

  const cardBrand = getCardBrand(form.cardNumber);

  const handleChange = (field, value) => {
    let formatted = value;

    if (field === "cardNumber") {
      formatted = formatCardNumber(value);
    } else if (field === "expiry") {
      formatted = formatExpiry(value);
    } else if (field === "cvv") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((prev) => ({ ...prev, [field]: formatted }));

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, formatted) }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field]) }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "cardNumber": {
        const digits = value.replace(/\D/g, "");
        if (digits.length === 0) {
          return "Ingresa el numero de tarjeta.";
        }
        if (digits.length < 13) {
          return "Numero de tarjeta muy corto.";
        }
        if (!isValidLuhn(digits)) {
          return "Numero de tarjeta invalido.";
        }
        return "";
      }
      case "titular":
        if (!value.trim()) {
          return "Ingresa el nombre del titular.";
        }
        if (value.trim().length < 3) {
          return "Nombre muy corto.";
        }
        return "";
      case "expiry":
        if (!value) {
          return "Ingresa la fecha de expiracion.";
        }
        if (!isExpiryValid(value)) {
          return "Fecha invalida o vencida.";
        }
        return "";
      case "cvv": {
        const cvvDigits = value.replace(/\D/g, "");
        if (cvvDigits.length < 3) {
          return "CVV invalido (3-4 digitos).";
        }
        return "";
      }
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {
      cardNumber: validateField("cardNumber", form.cardNumber),
      titular: validateField("titular", form.titular),
      expiry: validateField("expiry", form.expiry),
      cvv: validateField("cvv", form.cvv),
    };

    setErrors(newErrors);
    setTouched({ cardNumber: true, titular: true, expiry: true, cvv: true });

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isProcessing) {
      return;
    }

    if (!validateAll()) {
      return;
    }

    const digits = form.cardNumber.replace(/\D/g, "");

    onSubmit({
      ultimos4: digits.slice(-4),
      titular: form.titular.trim(),
    });
  };

  const formatCurrency = (value) => `S/. ${Number(value || 0).toFixed(2)}`;

  return (
    <section className={styles.pagoSection}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>💳</span>
        Informacion de Pago
      </h3>

      <form className={styles.cardForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.cardPreview}>
          <div className={styles.cardChip} />
          <div className={styles.cardBrands}>
            <span className={`${styles.brandIcon} ${cardBrand === "visa" ? styles.brandActive : ""}`}>
              VISA
            </span>
            <span className={`${styles.brandIcon} ${cardBrand === "mastercard" ? styles.brandActive : ""}`}>
              MC
            </span>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="checkout-card-number" className={styles.fieldLabel}>
            Numero de tarjeta
          </label>
          <input
            id="checkout-card-number"
            type="text"
            inputMode="numeric"
            className={`${styles.fieldInput} ${errors.cardNumber && touched.cardNumber ? styles.fieldError : ""}`}
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            onBlur={() => handleBlur("cardNumber")}
            disabled={isProcessing}
            autoComplete="cc-number"
          />
          {errors.cardNumber && touched.cardNumber ? (
            <p className={styles.errorMsg}>{errors.cardNumber}</p>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="checkout-titular" className={styles.fieldLabel}>
            Nombre del titular
          </label>
          <input
            id="checkout-titular"
            type="text"
            className={`${styles.fieldInput} ${errors.titular && touched.titular ? styles.fieldError : ""}`}
            placeholder="Como aparece en la tarjeta"
            value={form.titular}
            onChange={(e) => handleChange("titular", e.target.value)}
            onBlur={() => handleBlur("titular")}
            disabled={isProcessing}
            autoComplete="cc-name"
          />
          {errors.titular && touched.titular ? (
            <p className={styles.errorMsg}>{errors.titular}</p>
          ) : null}
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="checkout-expiry" className={styles.fieldLabel}>
              Expiracion
            </label>
            <input
              id="checkout-expiry"
              type="text"
              inputMode="numeric"
              className={`${styles.fieldInput} ${errors.expiry && touched.expiry ? styles.fieldError : ""}`}
              placeholder="MM/AA"
              value={form.expiry}
              onChange={(e) => handleChange("expiry", e.target.value)}
              onBlur={() => handleBlur("expiry")}
              disabled={isProcessing}
              autoComplete="cc-exp"
            />
            {errors.expiry && touched.expiry ? (
              <p className={styles.errorMsg}>{errors.expiry}</p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="checkout-cvv" className={styles.fieldLabel}>
              CVV
            </label>
            <input
              id="checkout-cvv"
              type="password"
              inputMode="numeric"
              className={`${styles.fieldInput} ${errors.cvv && touched.cvv ? styles.fieldError : ""}`}
              placeholder="•••"
              value={form.cvv}
              onChange={(e) => handleChange("cvv", e.target.value)}
              onBlur={() => handleBlur("cvv")}
              disabled={isProcessing}
              autoComplete="cc-csc"
            />
            {errors.cvv && touched.cvv ? (
              <p className={styles.errorMsg}>{errors.cvv}</p>
            ) : null}
          </div>
        </div>

        <button
          id="checkout-pay-button"
          type="submit"
          className={styles.payButton}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className={styles.payButtonLoading}>
              <span className={styles.spinner} />
              Procesando pago...
            </span>
          ) : (
            "Pagar ahora"
          )}
        </button>

        <p className={styles.secureNote}>
          <span className={styles.lockIcon}>🔒</span>
          Pago seguro — Tus datos estan protegidos
        </p>
      </form>
    </section>
  );
}
