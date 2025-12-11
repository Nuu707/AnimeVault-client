// src/pages/Gallery.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import fetchAnimes from "../api/animeAPI";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";

const GENRES = [
  "All", "Action", "Adventure", "Romance", "Comedy", "Drama", "Fantasy",
  "Horror", "Supernatural", "Superheroes", "Historical", "Slice of Life",
  "Mecha", "Suspense", "Mystery", "Music", "Sci-Fi"
];

const Gallery = () => {
  const { theme, toggleTheme } = useTheme();
  const { query } = useSearch();

  const [searchVisible, setSearchVisible] = useState(false);
  const [animes, setAnimes] = useState([]);
  const [genreFilter, setGenreFilter] = useState("All");
  const [sortOption, setSortOption] = useState("title-asc");
  const [viewType, setViewType] = useState("grid");

  // --- Load all animes ---
  useEffect(() => {
    fetchAnimes().then(setAnimes).catch(console.error);
  }, []);

  const toggleSearch = () => setSearchVisible((prev) => !prev);

  // --- Filter, search, and sort animes ---
  const filteredAnimes = animes
    .filter(a => genreFilter === "All" || a.genre?.includes(genreFilter))
    .filter(a => !query || a.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const gridIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
      <path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520Z"/>
    </svg>
  );

  const listIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
      <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280Z"/>
    </svg>
  );

  return (
    <>
      <Navbar
        onSearchToggle={toggleSearch}
        onThemeToggle={toggleTheme}
        theme={theme}
      />

      <SearchBar visible={searchVisible} />

      <main className="container catalog-section">
        <div className="section-header">
          <h2>Gallery</h2>

          <div className="filters">
            {/* Genre Filter */}
            <div className="filter">
              <label htmlFor="genre-filter">Filter by genre:</label>
              <select
                id="genre-filter"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="filter">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="filter">
              <button
                className={`view-toggle ${viewType === "grid" ? "active" : ""}`}
                onClick={() => setViewType("grid")}
                title="Grid view"
              >
                {gridIcon}
              </button>
              <button
                className={`view-toggle ${viewType === "list" ? "active" : ""}`}
                onClick={() => setViewType("list")}
                title="List view"
              >
                {listIcon}
              </button>
            </div>
          </div>
        </div>

        {/* Anime catalog */}
        <div className={viewType === "grid" ? "catalog-grid" : "catalog-list"}>
          {filteredAnimes.length > 0 ? (
            filteredAnimes.map((anime) =>
              viewType === "grid" ? (
                <div key={anime._id} className="card-compact">
                  <Link to={`/detail/${anime._id}`}>
                    <img src={anime.image} alt={anime.title} />
                    <div className="overlay">
                      <h3>{anime.title}</h3>
                      <p className="description">
                        {anime.description?.length > 100
                          ? anime.description.slice(0, 100) + "..."
                          : anime.description}
                      </p>
                      <span className="tag">{anime.genre?.[0]}</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <Link key={anime._id} to={`/detail/${anime._id}`} className="card-list">
                  <img src={anime.image} alt={anime.title} />
                  <div className="overlay">
                    <h3>{anime.title}</h3>
                    <p className="description">{anime.description}</p>
                  </div>
                  <div className="extra-info">
                    <span className="tag">{anime.genre?.[0]}</span>
                  </div>
                </Link>
              )
            )
          ) : (
            <p>No results found for "{query}"</p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Gallery;
