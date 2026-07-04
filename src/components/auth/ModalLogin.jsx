import { useCallback, useEffect, useState } from "react";
import styles from "../../css_components/ModalLogin.module.css";
import useAuth from "../../auth/hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

const initialFormState = {
  name: "",
  email: "",
  password: "",
};

export default function ModalLogin({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState("login");
  const { login, register } = useAuth();

  const handleClose = useCallback(() => {
    setFormData(initialFormState);
    setErrorMessage("");
    setIsSubmitting(false);
    setMode("login");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage(t.login.errorCampos);
      return;
    }

    if (mode === "register" && !trimmedName) {
      setErrorMessage(t.login.errorNombre);
      return;
    }

    if (mode === "register" && trimmedPassword.length < 6) {
      setErrorMessage(t.login.errorPassword);
      return;
    }

    if (mode === "login") {
      setIsSubmitting(true);
      const result = await login({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      setIsSubmitting(false);
      if (!result.ok) {
        setErrorMessage(result.error);
        return;
      }
      handleClose();
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    handleClose();
  };

  const toggleMode = () => {
    setMode((previousMode) =>
      previousMode === "login" ? "register" : "login",
    );
    setErrorMessage("");
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      id="modal-login"
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-login-title"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label={t.login.ariaCerrar}
        >
          x
        </button>

        <h2 id="modal-login-title" className={styles.title}>
          {mode === "login" ? t.login.iniciarTitulo : t.login.crearTitulo}
        </h2>
        <p className={styles.subtitle}>
          {mode === "login" ? t.login.iniciarSub : t.login.crearSub}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <label className={styles.label} htmlFor="login-name">
                {t.login.nombre}
              </label>
              <input
                id="login-name"
                name="name"
                className={styles.input}
                type="text"
                placeholder={t.login.nombrePh}
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </>
          ) : null}

          <label className={styles.label} htmlFor="login-email">
            {t.login.correo}
          </label>
          <input
            id="login-email"
            name="email"
            className={styles.input}
            type="email"
            placeholder={t.login.correoPh}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label className={styles.label} htmlFor="login-password">
            {t.login.contrasena}
          </label>
          <input
            id="login-password"
            name="password"
            className={styles.input}
            type="password"
            placeholder={t.login.passwordPh}
            value={formData.password}
            onChange={handleChange}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
          />

          {errorMessage ? (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              {isSubmitting
                ? t.login.procesando
                : mode === "login"
                  ? t.login.entrar
                  : t.login.registrar}
            </button>
            <p className={styles.accountPrompt}>
              {mode === "login" ? t.login.noTienes : t.login.yaTienes}
              <button
                type="button"
                className={styles.accountLink}
                onClick={toggleMode}
              >
                {mode === "login"
                  ? t.login.registrateGratis
                  : t.login.iniciaSesion}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
