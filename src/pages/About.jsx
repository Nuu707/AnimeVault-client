// src/pages/About.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

/**
 * Página About
 * Explica qué es Anime Vault y sus funcionalidades principales.
 */
const About = () => {
  const { theme, toggleTheme } = useTheme(); // Usamos ThemeContext

  return (
    <>
      {/* Navbar: ocultamos icono de búsqueda en esta página */}
      <Navbar onThemeToggle={toggleTheme} theme={theme} showSearchIcon={false} />

      {/* Contenido principal */}
      <main className="section about-section container">
        <h1>What is Anime Vault?</h1>
        <p>
          <strong>Anime Vault</strong> is a platform designed for all anime lovers who
          want a simple and visual way to keep track of what they're watching.
        </p>

        <p>
          Save your favorite anime, organize what you are currently watching, mark the ones
          you've completed, and even track what you want to watch next. All in one place.
        </p>

        <p>
          Our goal is to let you enjoy your anime without wasting time searching for where
          you left off or which series you wanted to start.
        </p>

        {/* Tarjetas destacando características principales */}
        <div className="about-cards">
          <div className="about-card">
            <h3>Organize Your List</h3>
            <p>
              Categorize your anime as <strong>Plan to Watch</strong>, <strong>Watching</strong>,
              <strong>Completed</strong> or <strong>Dropped</strong> so you always know your progress.
            </p>
          </div>

          <div className="about-card">
            <h3>All at a Glance</h3>
            <p>
              Statistics, favorites, categories. Anime Vault turns your list
              into a visual and easy-to-navigate space.
            </p>
          </div>

          <div className="about-card">
            <h3>A Modern Experience</h3>
            <p>
              Intuitive design, dark mode, adaptable to any device, and fast navigation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;
