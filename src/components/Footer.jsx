// src/components/Footer.jsx
import React from "react";

/**
 * Footer global de la aplicación.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© 2025 AnimeVault</div>

        <div className="footer-links">
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
