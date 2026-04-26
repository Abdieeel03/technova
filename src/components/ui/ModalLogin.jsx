import { useCallback, useEffect, useState } from "react";
import styles from "../../css_components/ModalLogin.module.css";

const initialFormState = {
    name: "",
    email: "",
    password: "",
};

export default function ModalLogin({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState(initialFormState);
    const [errorMessage, setErrorMessage] = useState("");
    const [mode, setMode] = useState("login");

    const handleClose = useCallback(() => {
        setFormData(initialFormState);
        setErrorMessage("");
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPassword = formData.password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setErrorMessage("Completa correo y contrasena para continuar.");
            return;
        }

        if (mode === "register" && !trimmedName) {
            setErrorMessage("Ingresa tu nombre para registrarte.");
            return;
        }

        if (mode === "register" && trimmedPassword.length < 6) {
            setErrorMessage("La contrasena debe tener al menos 6 caracteres.");
            return;
        }

        const displayName =
            trimmedName || trimmedEmail.split("@")[0] || "Usuario";

        onSubmit({
            name: displayName,
            email: trimmedEmail,
            mode,
        });
    };

    const toggleMode = () => {
        setMode((previousMode) =>
            previousMode === "login" ? "register" : "login"
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
            <div className={styles.modal} onMouseDown={(event) => event.stopPropagation()}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Cerrar formulario de login"
                >
                    x
                </button>

                <h2 id="modal-login-title" className={styles.title}>
                    {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
                </h2>
                <p className={styles.subtitle}>
                    {mode === "login"
                        ? "Accede a tu perfil para continuar con tu compra."
                        : "Registra tu cuenta para comprar mas rapido."}
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor="login-name">
                        Nombre
                    </label>
                    <input
                        id="login-name"
                        name="name"
                        className={styles.input}
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required={mode === "register"}
                    />

                    <label className={styles.label} htmlFor="login-email">
                        Correo
                    </label>
                    <input
                        id="login-email"
                        name="email"
                        className={styles.input}
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <label className={styles.label} htmlFor="login-password">
                        Contrasena
                    </label>
                    <input
                        id="login-password"
                        name="password"
                        className={styles.input}
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    {errorMessage ? (
                        <p className={styles.errorMessage} role="alert">
                            {errorMessage}
                        </p>
                    ) : null}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitButton}>
                            {mode === "login" ? "Entrar" : "Registrar"}
                        </button>
                        <p className={styles.accountPrompt}>
                            {mode === "login" ? "No tienes cuenta?" : "Ya tienes cuenta?"}
                            <button
                                type="button"
                                className={styles.accountLink}
                                onClick={toggleMode}
                            >
                                {mode === "login" ? "Registrate gratis" : "Inicia sesion"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}