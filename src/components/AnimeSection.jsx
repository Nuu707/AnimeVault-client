// src/components/AnimeSection.jsx
import React, { useState, useEffect } from "react";
import fetchAnimes from "../api/animeAPI";

const AnimeSection = ({ query = "" }) => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnimes = async () => {
      try {
        const data = await fetchAnimes();
        console.log("Received data from API:", data);
        setAnimes(data);
      } catch (err) {
        console.error("Error loading animes:", err);
      } finally {
        setLoading(false);
      }
    };

    getAnimes();
  }, []);

  if (loading) {
    return <p>Loading animes...</p>;
  }

  const filteredAnimes = query
    ? animes.filter((anime) =>
        anime.title.toLowerCase().includes(query.toLowerCase())
      )
    : animes;

  if (query) {
    return (
      <section className="container section">
        <div className="section-header">
          <h2>Search Results</h2>
        </div>
        {filteredAnimes.length > 0 ? (
          <div className="grid">
            {filteredAnimes.map((anime) => (
              <div key={anime._id} className="card">
                <a href={`/detail/${anime._id}`}>
                  <img src={anime.image} alt={anime.title} />
                  <div className="card-info">
                    <h3>{anime.title}</h3>
                    <p className="description">{anime.description}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found for "{query}".</p>
        )}
      </section>
    );
  }

  // Show only the 3 latest added animes
  const latestAnimes = animes.slice(-3).reverse();

  return (
    <section className="container section">
      <div className="section-header">
        <h2>Latest Added Anime</h2>
      </div>
      <div className="grid">
        {latestAnimes.map((anime) => (
          <div key={anime._id} className="card">
            <a href={`/detail/${anime._id}`}>
              <img src={anime.image} alt={anime.title} />
              <div className="card-info">
                <h3>{anime.title}</h3>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimeSection;
