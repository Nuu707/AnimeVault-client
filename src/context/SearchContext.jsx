// src/context/SearchContext.jsx
import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

/**
 * Proveedor de contexto para la búsqueda global de animes.
 * Permite que cualquier componente pueda acceder al término de búsqueda y actualizarlo.
 */
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState(""); // estado global del término de búsqueda

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Hook personalizado para consumir SearchContext.
 * @returns {{ query: string, setQuery: function }}
 */
export const useSearch = () => useContext(SearchContext);
