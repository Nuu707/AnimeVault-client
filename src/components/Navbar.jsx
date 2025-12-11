// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Barra de navegación principal de la aplicación.
 * Soporta:
 *  - Menú móvil
 *  - Login/Logout dinámico
 *  - Icono de búsqueda
 *  - Cambio de tema (dark/light)
 */
const Navbar = ({
  onSearchToggle,
  onThemeToggle,
  theme,
  showSearchIcon = true,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /**
   * Cierra la sesión eliminando el token y redirigiendo a /login
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /**
   * Abre o cierra el menú móvil (solo en mobile)
   */
  const toggleMobileMenu = () => {
    const nav = document.querySelector(".nav-desktop");
    if (nav) {
      nav.classList.toggle("mobile-open");
    }
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">

        {/* LOGO */}
        <div className="logo">
          <Link to="/" aria-label="AnimeVault Home">
            AnimeVault
          </Link>
        </div>

        {/* HAMBURGER BUTTON (VISIBLE SOLO EN MOBILE) */}
        <button
          className="mobile-menu-toggle"
          aria-label="Open menu"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>

        {/* NAV DESKTOP (hidden en mobile via CSS) */}
        <nav className="nav-desktop" aria-label="Main navigation">

          {/* ICONO DE BÚSQUEDA */}
          {showSearchIcon && (
            <button
              aria-label="Open search"
              className="search-icon"
              onClick={onSearchToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 
                  75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 
                  252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 
                  0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            </button>
          )}

          {/* ENLACES PRINCIPALES */}
          <Link to="/gallery" className="nav-link">Gallery</Link>
          {token && <Link to="/dashboard" className="nav-link">Profile</Link>}
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          {/* LOGIN / REGISTER */}
          {!token && (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-ghost">Register</Link>
            </>
          )}

          {/* LOGOUT */}
          {token && (
            <button onClick={handleLogout} className="btn-ghost">
              Logout
            </button>
          )}

          {/* TOGGLE DE TEMA */}
          <button className="btn-ghost" onClick={onThemeToggle}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
