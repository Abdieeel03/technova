import { useEffect, useState } from "react";
import styles from "../../css_components/Header.module.css";
import logo from "../../assets/img/logo.svg";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import ModalLogin from "../auth/ModalLogin";
import CarritoButton from "../cart/CarritoButton";
import CarritoModal from "../cart/CarritoModal";
import useCarrito from "../../hooks/useCarrito";
import useAuth from "../../auth/hooks/useAuth";
import { createOrder } from "../../services/ordersStorage";
import { useLanguage } from "../../context/LanguageContext";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    items,
    totalItems,
    totalPrice,
    updateItemQty,
    removeItem,
    clearCart,
    setCartOwner,
  } = useCarrito();

  const { user, logout } = useAuth();
  const [checkoutNotice, setCheckoutNotice] = useState(null);

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

  const openCarrito = () => {
    setIsCarritoOpen(true);
  };

  const closeCarrito = () => {
    setIsCarritoOpen(false);
  };

  const handleLogout = () => {
    logout();
    clearCart();
  };

  const routeSearchParams = new URLSearchParams(location.search);
  const hasLoginModalQuery = routeSearchParams.get("modal") === "login";
  const isModalOpen = isLoginOpen || (hasLoginModalQuery && !user);

  useEffect(() => {
    setCartOwner(user?.id ?? null);
  }, [setCartOwner, user?.id]);

  const handleCheckout = () => {
    if (!user) {
      setCheckoutNotice({
        type: "error",
        text: t.login.iniciarSub,
      });
      setIsCarritoOpen(false);
      openLogin();
      return;
    }
    const result = createOrder({
      userId: user.id,
      items,
      total: totalPrice,
    });
    if (!result.ok) {
      setCheckoutNotice({ type: "error", text: result.error });
      return;
    }
    clearCart();
    setCheckoutNotice({
      type: "success",
      text: t.misCompras.subtitulo,
    });
  };

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
          aria-label={t.nav.ariaInicio}
        >
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.headerTitle}>TechNova</h1>
        </Link>
        <div className={styles.loginContainer}>
          <CarritoButton totalItems={totalItems} onClick={openCarrito} />
          {user ? (
            <Link
              to="/mis-compras"
              className={`${styles.login} ${styles.loginLogged}`}
              aria-label={t.nav.ariaMisCompras}
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
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <div className={styles.loginText}>
                <span className={styles.loginLabel}>{t.nav.bienvenido}</span>
                <span className={styles.loginValue}>{user.name}</span>
              </div>
              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
                aria-label={t.nav.ariaCerrarSesion}
              >
                {t.nav.salir}
              </button>
            </Link>
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
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <div className={styles.loginText}>
                <span className={styles.loginLabel}>{t.nav.bienvenido}</span>
                <span className={styles.loginAction}>{t.nav.iniciaSesion}</span>
              </div>
            </button>
          )}
        </div>
      </header>
      <nav className={styles.nav} aria-label={t.nav.ariaNav}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              end
            >
              {t.nav.inicio}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              {t.nav.productos}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/nosotros"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              {t.nav.nosotros}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              {t.nav.contacto}
            </NavLink>
          </li>
        </ul>
      </nav>
      <ModalLogin isOpen={isModalOpen} onClose={closeLogin} />
      <CarritoModal
        isOpen={isCarritoOpen}
        items={items}
        totalPrice={totalPrice}
        notice={checkoutNotice}
        onCheckout={handleCheckout}
        onClose={closeCarrito}
        onUpdateQty={updateItemQty}
        onRemoveItem={removeItem}
        onClear={clearCart}
      />
    </>
  );
}
