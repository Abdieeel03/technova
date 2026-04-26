import { useEffect, useState } from "react";
import styles from "../../css_components/Header.module.css";
import logo from "../../assets/img/logo.svg";
import { NavLink, Link, useLocation, useNavigate } from "react-router";
import ModalLogin from "./ModalLogin";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("technovaUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("technovaUser", JSON.stringify(user));
      return;
    }

    localStorage.removeItem("technovaUser");
  }, [user]);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const clearLoginModalQuery = () => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get("modal") !== "login") {
      return;
    }

    searchParams.delete("modal");
    const nextSearch = searchParams.toString();

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    clearLoginModalQuery();
  };

  const handleLogin = (loginData) => {
    setUser(loginData);
    setIsLoginOpen(false);
    clearLoginModalQuery();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const routeSearchParams = new URLSearchParams(location.search);
  const hasLoginModalQuery = routeSearchParams.get("modal") === "login";
  const isModalOpen = isLoginOpen || (hasLoginModalQuery && !user);

  useEffect(() => {
    if (!user || !hasLoginModalQuery) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("modal");
    const nextSearch = searchParams.toString();

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [hasLoginModalQuery, location.pathname, location.search, navigate, user]);

  return (
    <>
      <header className={styles.header}>
        <Link
          className={styles.headerLink}
          to="/"
          aria-label="Ir al inicio de TechNova"
        >
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.headerTitle}>TechNova</h1>
        </Link>
        <div className={styles.loginContainer}>
          {user ? (
            <div className={`${styles.login} ${styles.loginLogged}`}>
              <div className={styles.svgIcon} aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-user"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <div className={styles.loginText}>
                <span className={styles.loginLabel}>BIENVENIDO</span>
                <span className={styles.loginValue}>{user.name}</span>
              </div>
              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.login}
              onClick={openLogin}
              aria-haspopup="dialog"
              aria-controls="modal-login"
            >
              <div className={styles.svgIcon} aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-user"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <div className={styles.loginText}>
                <span className={styles.loginLabel}>BIENVENIDO</span>
                <span className={styles.loginAction}>Iniciar sesión</span>
              </div>
            </button>
          )}
        </div>
      </header>
      <nav className={styles.nav} aria-label="Navegacion principal">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              end
              aria-label="Ir a Inicio"
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              aria-label="Ir a Productos"
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/nosotros"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              aria-label="Ir a Nosotros"
            >
              Nosotros
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              aria-label="Ir a Contacto"
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
      <ModalLogin
        isOpen={isModalOpen}
        onClose={closeLogin}
        onSubmit={handleLogin}
      />
    </>
  );
}
