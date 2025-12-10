import React from "react";
import { useSearch } from "../context/SearchContext";

const SearchBar = ({ visible }) => {
  const { query, setQuery } = useSearch();

  if (!visible) return null;

  return (
    <div className={`search-bar-container ${visible ? "visible" : ""}`}>
      <input
        type="text"
        className="search-bar"
        placeholder="Search anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // updates global context
        autoFocus
      />
    </div>
  );
};

export default SearchBar;
