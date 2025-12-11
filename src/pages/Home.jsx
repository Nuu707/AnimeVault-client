// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Hero from "../components/Hero";
import AnimeSection from "../components/AnimeSection";
import Footer from "../components/Footer";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const { query } = useSearch();
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSearchBar = () => setSearchVisible((prev) => !prev);

  return (
    <>
      <Navbar
        onThemeToggle={toggleTheme}
        theme={theme}
        onSearchToggle={toggleSearchBar}
      />

      <SearchBar visible={searchVisible} />

      <main>
        {/* Hero banner only if no search query */}
        {!query && <Hero />}

        {/* Anime section (filtered by query if present) */}
        <AnimeSection query={query} showLatest={false} />

        {/* About call-to-action */}
        {!query && (
          <section
            className="about-banner"
            style={{
              margin: "2rem auto",
              padding: "2rem",
              borderRadius: "12px",
              backgroundColor: "var(--surface)",
              textAlign: "center",
              cursor: "pointer",
              maxWidth: "900px",
            }}
            onClick={() => navigate("/about")}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>
              Want to learn more about this project?
            </h2>
            <p style={{ opacity: 0.8 }}>
              Click here to go to the About page
            </p>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Home;
