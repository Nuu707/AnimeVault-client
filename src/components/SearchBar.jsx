// src/components/SearchBar.jsx
import React from "react";
import { useSearch } from "../context/SearchContext";

/**
 * Barra de búsqueda global para animes.
 * Solo se muestra si `visible` es true.
 * 
 * @param {boolean} visible - Controla si la barra se muestra u oculta.
 */
const SearchBar = ({ visible }) => {
  const { query, setQuery } = useSearch();

  // No renderiza nada si la barra no es visible
  if (!visible) return null;

  return (
    <div className={`search-bar-container ${visible ? "visible" : ""}`}>
      <input
        type="text"
        className="search-bar"
        placeholder="Search anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Actualiza el contexto global
        autoFocus
      />
    </div>
  );
};

export default SearchBar;
