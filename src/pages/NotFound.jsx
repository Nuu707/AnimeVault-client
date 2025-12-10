// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Navbar 
        onThemeToggle={toggleTheme} 
        theme={theme} 
        showSearchIcon={false} 
      />

      <main className="section not-found container">
        <h1>404</h1>
        <p className="error-text">Oops... We couldn't find this page.</p>
        <p>The anime you're looking for might have been removed or is in another dimension 😅</p>

        <button className="btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </main>

      <Footer />
    </>
  );
};

export default NotFound;
