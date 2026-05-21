[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex b2ec404..753aba8 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -2299,9 +2299,9 @@[m
       }[m
     },[m
     "node_modules/postcss": {[m
[31m-      "version": "8.5.10",[m
[31m-      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.10.tgz",[m
[31m-      "integrity": "sha512-pMMHxBOZKFU6HgAZ4eyGnwXF/EvPGGqUr0MnZ5+99485wwW41kW91A4LOGxSHhgugZmSChL5AlElNdwlNgcnLQ==",[m
[32m+[m[32m      "version": "8.5.9",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.9.tgz",[m
[32m+[m[32m      "integrity": "sha512-7a70Nsot+EMX9fFU3064K/kdHWZqGVY+BADLyXc8Dfv+mTLLVl6JzJpPaCZ2kQL9gIJvKXSLMHhqdRRjwQeFtw==",[m
       "dev": true,[m
       "funding": [[m
         {[m
[1mdiff --git a/src/App.jsx b/src/App.jsx[m
[1mindex f5efc21..4ed5071 100644[m
[1m--- a/src/App.jsx[m
[1m+++ b/src/App.jsx[m
[36m@@ -1,6 +1,6 @@[m
 import Header from "./components/ui/Header";[m
 import Footer from "./components/ui/Footer";[m
[31m-import { Navigate, Routes, Route } from "react-router-dom";[m
[32m+[m[32mimport { Routes, Route } from "react-router-dom";[m
 import Home from "./pages/Home";[m
 import Productos from "./pages/Productos";[m
 import DetalleProducto from "./pages/DetalleProducto";[m
[36m@@ -49,7 +49,14 @@[m [mfunction App() {[m
           />[m
           <Route[m
             path="/inicia-sesion"[m
[31m-            element={<Navigate to="/?modal=login" replace />}[m
[32m+[m[32m            element={[m
[32m+[m[32m              <InfoPage[m
[32m+[m[32m                title="Inicio de sesion"[m
[32m+[m[32m                description="Esta funcionalidad estara disponible en una proxima iteracion. Mientras tanto, puedes contactarnos para soporte comercial."[m
[32m+[m[32m                ctaLabel="Ir a contacto"[m
[32m+[m[32m                ctaTo="/contacto"[m
[32m+[m[32m              />[m
[32m+[m[32m            }[m
           />[m
           <Route path="*" element={<NotFound />} />[m
         </Routes>[m
[1mdiff --git a/src/components/ui/Footer.jsx b/src/components/ui/Footer.jsx[m
[1mindex 5f328fd..9dc9c39 100644[m
[1m--- a/src/components/ui/Footer.jsx[m
[1m+++ b/src/components/ui/Footer.jsx[m
[36m@@ -1,7 +1,7 @@[m
 import logo from "../../assets/img/logo.svg";[m
 import styles from "../../css_components/Footer.module.css";[m
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";[m
[31m-import { Link, useLocation } from "react-router";[m
[32m+[m[32mimport { Link } from "react-router";[m
 import {[m
   faFacebookF,[m
   faInstagram,[m
[36m@@ -9,15 +9,6 @@[m [mimport {[m
 } from "@fortawesome/free-brands-svg-icons";[m
 [m
 export default function Footer() {[m
[31m-  const location = useLocation();[m
[31m-  const searchParams = new URLSearchParams(location.search);[m
[31m-  searchParams.set("modal", "login");[m
[31m-[m
[31m-  const loginLinkTo = {[m
[31m-    pathname: location.pathname,[m
[31m-    search: `?${searchParams.toString()}`,[m
[31m-  };[m
[31m-[m
   return ([m
     <footer className={styles.footer}>[m
       <div className={styles.div1} aria-label="Politicas del sitio">[m
[36m@@ -28,7 +19,7 @@[m [mexport default function Footer() {[m
       </div>[m
       <div className={styles.div2} aria-label="Enlaces principales">[m
         <p>Enlaces directos</p>[m
[31m-        <Link to={loginLinkTo}>Inicia Sesión</Link>[m
[32m+[m[32m        <Link to="/inicia-sesion">Inicia Sesión</Link>[m
         <Link to="/productos">Productos</Link>[m
         <Link to="/contacto">Contactanos</Link>[m
       </div>[m
[1mdiff --git a/src/components/ui/Header.jsx b/src/components/ui/Header.jsx[m
[1mindex 0bc028e..bd1b094 100644[m
[1m--- a/src/components/ui/Header.jsx[m
[1m+++ b/src/components/ui/Header.jsx[m
[36m@@ -1,91 +1,8 @@[m
[31m-import { useEffect, useState } from "react";[m
 import styles from "../../css_components/Header.module.css";[m
 import logo from "../../assets/img/logo.svg";[m
[31m-import { NavLink, Link, useLocation, useNavigate } from "react-router";[m
[31m-import ModalLogin from "./ModalLogin";[m
[32m+[m[32mimport { NavLink, Link } from "react-router";[m
 [m
 export default function Header() {[m
[31m-  const [isLoginOpen, setIsLoginOpen] = useState(false);[m
[31m-  const location = useLocation();[m
[31m-  const navigate = useNavigate();[m
[31m-  const [user, setUser] = useState(() => {[m
[31m-    try {[m
[31m-      const savedUser = localStorage.getItem("technovaUser");[m
[31m-      return savedUser ? JSON.parse(savedUser) : null;[m
[31m-    } catch {[m
[31m-      return null;[m
[31m-    }[m
[31m-  });[m
[31m-[m
[31m-  useEffect(() => {[m
[31m-    if (user) {[m
[31m-      localStorage.setItem("technovaUser", JSON.stringify(user));[m
[31m-      return;[m
[31m-    }[m
[31m-[m
[31m-    localStorage.removeItem("technovaUser");[m
[31m-  }, [user]);[m
[31m-[m
[31m-  const openLogin = () => {[m
[31m-    setIsLoginOpen(true);[m
[31m-  };[m
[31m-[m
[31m-  const clearLoginModalQuery = () => {[m
[31m-    const searchParams = new URLSearchParams(location.search);[m
[31m-[m
[31m-    if (searchParams.get("modal") !== "login") {[m
[31m-      return;[m
[31m-    }[m
[31m-[m
[31m-    searchParams.delete("modal");[m
[31m-    const nextSearch = searchParams.toString();[m
[31m-[m
[31m-    navigate([m
[31m-      {[m
[31m-        pathname: location.pathname,[m
[31m-        search: nextSearch ? `?${nextSearch}` : "",[m
[31m-      },[m
[31m-      { replace: true },[m
[31m-    );[m
[31m-  };[m
[31m-[m
[31m-  const closeLogin = () => {[m
[31m-    setIsLoginOpen(false);[m
[31m-    clearLoginModalQuery();[m
[31m-  };[m
[31m-[m
[31m-  const handleLogin = (loginData) => {[m
[31m-    setUser(loginData);[m
[31m-    setIsLoginOpen(false);[m
[31m-    clearLoginModalQuery();[m
[31m-  };[m
[31m-[m
[31m-  const handleLogout = () => {[m
[31m-    setUser(null);[m
[31m-  };[m
[31m-[m
[31m-  const routeSearchParams = new URLSearchParams(location.search);[m
[31m-  const hasLoginModalQuery = routeSearchParams.get("modal") === "login";[m
[31m-  const isModalOpen = isLoginOpen || (hasLoginModalQuery && !user);[m
[31m-[m
[31m-  useEffect(() => {[m
[31m-    if (!user || !hasLoginModalQuery) {[m
[31m-      return;[m
[31m-    }[m
[31m-[m
[31m-    const searchParams = new URLSearchParams(location.search);[m
[31m-    searchParams.delete("modal");[m
[31m-    const nextSearch = searchParams.toString();[m
[31m-[m
[31m-    navigate([m
[31m-      {[m
[31m-        pathname: location.pathname,[m
[31m-        search: nextSearch ? `?${nextSearch}` : "",[m
[31m-      },[m
[31m-      { replace: true },[m
[31m-    );[m
[31m-  }, [hasLoginModalQuery, location.pathname, location.search, navigate, user]);[m
[31m-[m
   return ([m
     <>[m
       <header className={styles.header}>[m
[36m@@ -97,73 +14,6 @@[m [mexport default function Header() {[m
           <img className={styles.logo} src={logo} alt="Logo" />[m
           <h1 className={styles.headerTitle}>TechNova</h1>[m
         </Link>[m
[31m-        <div className={styles.loginContainer}>[m
[31m-          {user ? ([m
[31m-            <div className={`${styles.login} ${styles.loginLogged}`}>[m
[31m-              <div className={styles.svgIcon} aria-hidden="true">[m
[31m-                <svg[m
[31m-                  xmlns="http://www.w3.org/2000/svg"[m
[31m-                  width="24"[m
[31m-                  height="24"[m
[31m-                  viewBox="0 0 24 24"[m
[31m-                  fill="none"[m
[31m-                  stroke="currentColor"[m
[31m-                  strokeWidth="2"[m
[31m-                  strokeLinecap="round"[m
[31m-                  strokeLinejoin="round"[m
[31m-                  className="icon icon-tabler icons-tabler-outline icon-tabler-user"[m
[31m-                >[m
[31m-                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />[m
[31m-                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />[m
[31m-                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />[m
[31m-                </svg>[m
[31m-              </div>[m
[31m-              <div className={styles.loginText}>[m
[31m-                <span className={styles.loginLabel}>BIENVENIDO</span>[m
[31m-                <span className={styles.loginValue}>{user.name}</span>[m
[31m-              </div>[m
[31m-              <button[m
[31m-                type="button"[m
[31m-                className={styles.logoutButton}[m
[31m-                onClick={handleLogout}[m
[31m-                aria-label="Cerrar sesión"[m
[31m-              >[m
[31m-                Salir[m
[31m-              </button>[m
[31m-            </div>[m
[31m-          ) : ([m
[31m-            <button[m
[31m-              type="button"[m
[31m-              className={styles.login}[m
[31m-              onClick={openLogin}[m
[31m-              aria-haspopup="dialog"[m
[31m-              aria-controls="modal-login"[m
[31m-            >[m
[31m-              <div className={styles.svgIcon} aria-hidden="true">[m
[31m-                <svg[m
[31m-                  xmlns="http://www.w3.org/2000/svg"[m
[31m-                  width="24"[m
[31m-                  height="24"[m
[31m-                  viewBox="0 0 24 24"[m
[31m-                  fill="none"[m
[31m-                  stroke="currentColor"[m
[31m-                  strokeWidth="2"[m
[31m-                  strokeLinecap="round"[m
[31m-                  strokeLinejoin="round"[m
[31m-                  className="icon icon-tabler icons-tabler-outline icon-tabler-user"[m
[31m-                >[m
[31m-                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />[m
[31m-                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />[m
[31m-                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />[m
[31m-                </svg>[m
[31m-              </div>[m
[31m-              <div className={styles.loginText}>[m
[31m-                <span className={styles.loginLabel}>BIENVENIDO</span>[m
[31m-                <span className={styles.loginAction}>Iniciar sesión</span>[m
[31m-              </div>[m
[31m-            </button>[m
[31m-          )}[m
[31m-        </div>[m
       </header>[m
       <nav className={styles.nav} aria-label="Navegacion principal">[m
         <ul>[m
[36m@@ -214,11 +64,6 @@[m [mexport default function Header() {[m
           </li>[m
         </ul>[m
       </nav>[m
[31m-      <ModalLogin[m
[31m-        isOpen={isModalOpen}[m
[31m-        onClose={closeLogin}[m
[31m-        onSubmit={handleLogin}[m
[31m-      />[m
     </>[m
   );[m
 }[m
[1mdiff --git a/src/components/ui/ModalLogin.jsx b/src/components/ui/ModalLogin.jsx[m
[1mdeleted file mode 100644[m
[1mindex a168748..0000000[m
[1m--- a/src/components/ui/ModalLogin.jsx[m
[1m+++ /dev/null[m
[36m@@ -1,204 +0,0 @@[m
[31m-import { useCallback, useEffect, useState } from "react";[m
[31m-import styles from "../../css_components/ModalLogin.module.css";[m
[31m-[m
[31m-const initialFormState = {[m
[31m-    name: "",[m
[31m-    email: "",[m
[31m-    password: "",[m
[31m-};[m
[31m-[m
[31m-export default function ModalLogin({ isOpen, onClose, onSubmit }) {[m
[31m-    const [formData, setFormData] = useState(initialFormState);[m
[31m-    const [errorMessage, setErrorMessage] = useState("");[m
[31m-    const [mode, setMode] = useState("login");[m
[31m-[m
[31m-    const handleClose = useCallback(() => {[m
[31m-        setFormData(initialFormState);[m
[31m-        setErrorMessage("");[m
[31m-        setMode("login");[m
[31m-        onClose();[m
[31m-    }, [onClose]);[m
[31m-[m
[31m-    useEffect(() => {[m
[31m-        if (!isOpen) {[m
[31m-            return undefined;[m
[31m-        }[m
[31m-[m
[31m-        const previousOverflow = document.body.style.overflow;[m
[31m-        document.body.style.overflow = "hidden";[m
[31m-[m
[31m-        const handleEscape = (event) => {[m
[31m-            if (event.key === "Escape") {[m
[31m-                handleClose();[m
[31m-            }[m
[31m-        };[m
[31m-[m
[31m-        document.addEventListener("keydown", handleEscape);[m
[31m-[m
[31m-        return () => {[m
[31m-            document.body.style.overflow = previousOverflow;[m
[31m-            document.removeEventListener("keydown", handleEscape);[m
[31m-        };[m
[31m-    }, [isOpen, handleClose]);[m
[31m-[m
[31m-    if (!isOpen) {[m
[31m-        return null;[m
[31m-    }[m
[31m-[m
[31m-    const handleChange = (event) => {[m
[31m-        const { name, value } = event.target;[m
[31m-        setFormData((previous) => ({[m
[31m-            ...previous,[m
[31m-            [name]: value,[m
[31m-        }));[m
[31m-[m
[31m-        if (errorMessage) {[m
[31m-            setErrorMessage("");[m
[31m-        }[m
[31m-    };[m
[31m-[m
[31m-    const handleSubmit = (event) => {[m
[31m-        event.preventDefault();[m
[31m-[m
[31m-        const trimmedName = formData.name.trim();[m
[31m-        const trimmedEmail = formData.email.trim();[m
[31m-        const trimmedPassword = formData.password.trim();[m
[31m-[m
[31m-        if (!trimmedEmail || !trimmedPassword) {[m
[31m-            setErrorMessage("Completa correo y contrasena para continuar.");[m
[31m-            return;[m
[31m-        }[m
[31m-[m
[31m-        if (mode === "register" && !trimmedName) {[m
[31m-            setErrorMessage("Ingresa tu nombre para registrarte.");[m
[31m-            return;[m
[31m-        }[m
[31m-[m
[31m-        if (mode === "register" && trimmedPassword.length < 6) {[m
[31m-            setErrorMessage("La contrasena debe tener al menos 6 caracteres.");[m
[31m-            return;[m
[31m-        }[m
[31m-[m
[31m-        const displayName =[m
[31m-            trimmedName || trimmedEmail.split("@")[0] || "Usuario";[m
[31m-[m
[31m-        onSubmit({[m
[31m-            name: displayName,[m
[31m-            email: trimmedEmail,[m
[31m-            mode,[m
[31m-        });[m
[31m-    };[m
[31m-[m
[31m-    const toggleMode = () => {[m
[31m-        setMode((previousMode) =>[m
[31m-            previousMode === "login" ? "register" : "login"[m
[31m-        );[m
[31m-        setErrorMessage("");[m
[31m-    };[m
[31m-[m
[31m-    const handleOverlayClick = (event) => {[m
[31m-        if (event.target === event.currentTarget) {[m
[31m-            handleClose();[m
[31m-        }[m
[31m-    };[m
[31m-[m
[31m-    return ([m
[31m-        <div[m
[31m-            id="modal-login"[m
[31m-            className={styles.overlay}[m
[31m-            role="dialog"[m
[31m-            aria-modal="true"[m
[31m-            aria-labelledby="modal-login-title"[m
[31m-            onMouseDown={handleOverlayClick}[m
[31m-        >[m
[31m-            <div className={styles.modal} onMouseDown={(event) => event.stopPropagation()}>[m
[31m-                <button[m
[31m-                    type="button"[m
[31m-                    className={styles.closeButton}[m
[31m-                    onClick={handleClose}[m
[31m-                    aria-label="Cerrar formulario de login"[m
[31m-                >[m
[31m-                    x[m
[31m-                </button>[m
[31m-[m
[31m-                <h2 id="modal-login-title" className={styles.title}>[m
[31m-                    {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}[m
[31m-                </h2>[m
[31m-                <p className={styles.subtitle}>[m
[31m-                    {mode === "login"[m
[31m-                        ? "Accede a tu perfil para continuar con tu compra."[m
[31m-                        : "Registra tu cuenta para comprar mas rapido."}[m
[31m-                </p>[m
[31m-[m
[31m-                <form className={styles.form} onSubmit={handleSubmit}>[m
[31m-                    <label className={styles.label} htmlFor="login-name">[m
[31m-                        Nombre[m
[31m-                    </label>[m
[31m-                    <input[m
[31m-                        id="login-name"[m
[31m-                        name="name"[m
[31m-                        className={styles.input}[m
[31m-                        type="text"[m
[31m-                        placeholder="Tu nombre"[m
[31m-                        value={formData.name}[m
[31m-                        onChange={handleChange}[m
[31m-                        autoComplete="name"[m
[31m-                        required={mode === "register"}[m
[31m-                    />[m
[31m-[m
[31m-                    <label className={styles.label} htmlFor="login-email">[m
[31m-                        Correo[m
[31m-                    </label>[m
[31m-                    <input[m
[31m-                        id="login-email"[m
[31m-                        name="email"[m
[31m-                        className={styles.input}[m
[31m-                        type="email"[m
[31m-                        placeholder="correo@ejemplo.com"[m
[31m-                        value={formData.email}[m
[31m-                        onChange={handleChange}[m
[31m-                        autoComplete="email"[m
[31m-                        required[m
[31m-                    />[m
[31m-[m
[31m-                    <label className={styles.label} htmlFor="login-password">[m
[31m-                        Contrasena[m
[31m-                    </label>[m
[31m-                    <input[m
[31m-                        id="login-password"[m
[31m-                        name="password"[m
[31m-                        className={styles.input}[m
[31m-                        type="password"[m
[31m-                        placeholder="********"[m
[31m-                        value={formData.password}[m
[31m-                        onChange={handleChange}[m
[31m-                        autoComplete="current-password"[m
[31m-                        required[m
[31m-                    />[m
[31m-[m
[31m-                    {errorMessage ? ([m
[31m-                        <p className={styles.errorMessage} role="alert">[m
[31m-                            {errorMessage}[m
[31m-                        </p>[m
[31m-                    ) : null}[m
[31m-[m
[31m-                    <div className={styles.actions}>[m
[31m-                        <button type="submit" className={styles.submitButton}>[m
[31m-                            {mode === "login" ? "Entrar" : "Registrar"}[m
[31m-                        </button>[m
[31m-                        <p className={styles.accountPrompt}>[m
[31m-                            {mode === "login" ? "No tienes cuenta?" : "Ya tienes cuenta?"}[m
[31m-                            <button[m
[31m-                                type="button"[m
[31m-                                className={styles.accountLink}[m
[31m-                                onClick={toggleMode}[m
[31m-                            >[m
[31m-                                {mode === "login" ? "Registrate gratis" : "Inicia sesion"}[m
[31m-                            </button>[m
[31m-                        </p>[m
[31m-                    </div>[m
[31m-                </form>[m
[31m-            </div>[m
[31m-        </div>[m
[31m-    );[m
[31m-}[m
\ No newline at end of file[m
[1mdiff --git a/src/css_components/Header.module.css b/src/css_components/Header.module.css[m
[1mindex 9355adb..0a83105 100644[m
[1m--- a/src/css_components/Header.module.css[m
[1m+++ b/src/css_components/Header.module.css[m
[36m@@ -28,83 +28,6 @@[m
   height: 40px;[m
 }[m
 [m
[31m-.loginContainer{[m
[31m-  display: flex;[m
[31m-  align-items: center;[m
[31m-}[m
[31m-[m
[31m-.svgIcon {[m
[31m-  width: 24px;[m
[31m-  height: 24px;[m
[31m-  display: grid;[m
[31m-  place-items: center;[m
[31m-}[m
[31m-[m
[31m-.login{[m
[31m-  border: 1px solid rgba(255, 255, 255, 0.24);