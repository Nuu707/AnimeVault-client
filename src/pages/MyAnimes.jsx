// src/pages/MyAnimes.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const MyAnimes = () => {
  const { id } = useParams(); // id opcional para ver lista de un amigo
  const { theme, toggleTheme } = useTheme();

  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("All");

  const token = localStorage.getItem("token");

  /* ---------------------- HELPERS ---------------------- */
  const fetchAnimeData = async (animeId) => {
    if (!animeId) return null;
    try {
      const res = await fetch(`http://localhost:5000/api/anime/${animeId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const getAnimeId = (animeEntry) => {
    if (!animeEntry) return null;
    const a = animeEntry.animeId;
    if (!a) return null;
    return typeof a === "string" ? a : a._id || a.id || null;
  };

  /* ---------------------- NORMALIZE STATUS ---------------------- */
  const normalizeStatus = (status) => {
    if (!status) return "plan";
    switch (status.toLowerCase()) {
      case "plan":
      case "pendiente":
        return "plan";
      case "watching":
      case "viendo":
        return "watching";
      case "completed":
      case "completado":
        return "completed";
      case "dropped":
      case "cancelado":
        return "dropped";
      case "on-hold":
      case "onhold":
        return "on-hold";
      default:
        return status.toLowerCase();
    }
  };

  /* ---------------------- FETCH USER ANIMES ---------------------- */
  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const url = id
          ? `http://localhost:5000/api/user/${id}`
          : `http://localhost:5000/api/user/me`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Error fetching user animes:", res.status, await res.text());
          setAnimes([]);
          return;
        }

        const data = await res.json();
        let userAnimes = data.animes || [];

        // Poblar animes completos y normalizar status
        const populated = await Promise.all(
          userAnimes.map(async (entry) => {
            if (!entry) return entry;

            if (typeof entry.animeId === "string") {
              const fullAnime = await fetchAnimeData(entry.animeId);
              return { ...entry, animeId: fullAnime };
            }

            if (entry.animeId && !entry.animeId.title) {
              const maybe = await fetchAnimeData(entry.animeId._id || entry.animeId.id);
              return { ...entry, animeId: maybe || entry.animeId };
            }

            return { ...entry, status: normalizeStatus(entry.status) };
          })
        );

        setAnimes(populated);
      } catch (err) {
        console.error(err);
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [id, token]);

  /* ---------------------- FILTER LOGIC ---------------------- */
  const filteredAnimes = animes.filter((anime) => {
    const status = normalizeStatus(anime?.status);

    if (currentFilter === "All") return true;
    if (currentFilter === "Favorites") return anime?.favorite;

    const displayStatus =
      status === "plan"
        ? "Plan to watch"
        : status === "watching"
        ? "Watching"
        : status === "completed"
        ? "Completed"
        : status === "dropped"
        ? "Dropped"
        : status === "on-hold"
        ? "On-Hold"
        : status;

    return displayStatus === currentFilter;
  });

  /* ---------------------- FILTER BUTTONS DATA ---------------------- */
  const filterButtons = [
    { label: "All", value: "All" },
    { label: "Plan to watch", value: "Plan to watch" },
    { label: "Watching", value: "Watching" },
    { label: "Completed", value: "Completed" },
    { label: "On-Hold", value: "On-Hold" },
    { label: "Dropped", value: "Dropped" },
    { label: "Favorites", value: "Favorites" },
  ];

  /* ---------------------- FAVORITE ---------------------- */
  const toggleFavorite = async (animeEntry) => {
    const realId = getAnimeId(animeEntry);
    if (!realId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user/favorite/${realId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Error updating favorite:", await res.text());
        return;
      }

      setAnimes((prev) =>
        prev.map((entry) =>
          getAnimeId(entry) === realId ? { ...entry, favorite: !entry.favorite } : entry
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  /* ---------------------- DELETE ANIME ---------------------- */
  const deleteAnime = async (animeEntry) => {
    const realId = getAnimeId(animeEntry);
    if (!realId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user/my-animes/${realId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Error deleting anime:", await res.text());
        return;
      }

      setAnimes((prev) => prev.filter((entry) => getAnimeId(entry) !== realId));
    } catch (err) {
      console.error("Error deleting anime:", err);
    }
  };

  /* ---------------------- CHANGE STATUS ---------------------- */
  const changeStatus = async (animeEntry, displayStatus) => {
    const realId = getAnimeId(animeEntry);
    if (!realId) return;

    const normalizedStatus =
      displayStatus === "Plan to watch"
        ? "plan"
        : displayStatus === "Watching"
        ? "watching"
        : displayStatus === "Completed"
        ? "completed"
        : displayStatus === "Dropped"
        ? "dropped"
        : displayStatus === "On-Hold"
        ? "on-hold"
        : displayStatus;

    try {
      const res = await fetch(`http://localhost:5000/api/user/my-animes/${realId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: normalizedStatus }),
      });

      if (!res.ok) {
        console.error("Error updating status:", await res.text());
        return;
      }

      setAnimes((prev) =>
        prev.map((entry) =>
          getAnimeId(entry) === realId ? { ...entry, status: normalizedStatus } : entry
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  /* ---------------------- LOADING ---------------------- */
  if (loading) {
    return (
      <>
        <Navbar onThemeToggle={toggleTheme} theme={theme} />
        <main className="container section">
          <p>Loading your anime list...</p>
        </main>
        <Footer />
      </>
    );
  }

  /* ---------------------- MAIN RENDER ---------------------- */
  return (
    <>
      <Navbar onThemeToggle={toggleTheme} theme={theme} showSearchIcon={false} />

      <main className="container section">
        <div className="section-header">
          <h2>{id ? "Friend's Anime List" : "My Anime List"}</h2>
        </div>

        {/* FILTER BUTTONS */}
        <div className="filter-buttons">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              className={`filter-btn ${currentFilter === btn.value ? "active" : ""}`}
              onClick={() => setCurrentFilter(btn.value)}
              data-filter={btn.value}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ANIME TABLE */}
        {filteredAnimes.length === 0 ? (
          <p>No animes to show.</p>
        ) : (
          <table id="anime-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Favs</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAnimes.map((anime) => {
                const realId = getAnimeId(anime);
                const displayStatus =
                  anime.status === "plan"
                    ? "Plan to watch"
                    : anime.status === "watching"
                    ? "Watching"
                    : anime.status === "completed"
                    ? "Completed"
                    : anime.status === "dropped"
                    ? "Dropped"
                    : anime.status === "on-hold"
                    ? "On-Hold"
                    : anime.status;

                return (
                  <tr key={realId || anime._id}>
                    <td>
                      <img
                        src={anime.animeId?.image || "/assets/placeholder.png"}
                        alt={anime.animeId?.title || "Anime"}
                        style={{ width: "60px", borderRadius: "6px" }}
                      />
                    </td>
                    <td>{anime.animeId?.title || "-"}</td>
                    <td>{anime.animeId?.genre?.join(", ") || "-"}</td>
                    <td>
                      <select
                        value={displayStatus}
                        onChange={(e) => changeStatus(anime, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Plan to watch">Plan to watch</option>
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="On-Hold">On-Hold</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </td>

                    {/* FAVORITE COLUMN */}
                    <td className="favs-cell">
                      <button
                        className={`fav-btn ${anime.favorite ? "filled" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(anime);
                        }}
                        disabled={!realId}
                        title="Toggle favorite"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                          <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
                        </svg>
                      </button>
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="actions-cell">
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnime(anime);
                        }}
                        title="Remove from list"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      <Footer />
    </>
  );
};

export default MyAnimes;
