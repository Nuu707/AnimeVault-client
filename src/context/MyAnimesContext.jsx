// src/context/MyAnimesContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import {
  getMyAnimes,
  updateMyAnime,
  toggleFavorite as toggleFavoriteAPI,
  addToMyAnimes,
} from "../api/userAPI";

export const MyAnimesContext = createContext();

/**
 * Proveedor de contexto para gestionar la lista de animes del usuario.
 * Incluye:
 *  - Estado de carga
 *  - Lista de animes con detalles
 *  - Acciones: toggle favorito, actualizar estado, añadir y eliminar animes
 */
export const MyAnimesProvider = ({ children }) => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  /**
   * Normaliza el estado de un anime según valores del backend
   * @param {string} s - Estado original
   * @returns {string} Estado normalizado
   */
  const normalizeStatus = (s) => {
    if (!s) return "plan";
    switch (s.toLowerCase()) {
      case "pendiente":
        return "plan";
      case "viendo":
        return "watching";
      case "completado":
        return "completed";
      case "cancelado":
        return "dropped";
      case "on-hold":
        return "on-hold";
      default:
        return s;
    }
  };

  // -------------------------
  // FETCH ANIMES
  // -------------------------

  const fetchAnimes = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getMyAnimes(token);

      if (data && data.animes) {
        const loaded = data.animes
          .filter((item) => item.animeId)
          .map((item) => ({
            _id: item.animeId._id.toString(),
            title: item.animeId.title,
            genre: item.animeId.genre || [],
            description: item.animeId.description || "",
            image: item.animeId.image,
            status: normalizeStatus(item.status),
            favorite: item.favorite || false,
            notes: item.notes || "",
            addedAt: item.addedAt || null,
          }));

        setAnimes(loaded);
      }
    } catch (err) {
      console.error("Error fetching animes:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  // -------------------------
  // ACCIONES BACKEND
  // -------------------------

  /**
   * Alterna el estado favorito de un anime
   * @param {string} animeId
   */
  const toggleFavorite = async (animeId) => {
    try {
      await toggleFavoriteAPI(animeId, token);
      setAnimes((prev) =>
        prev.map((a) =>
          a._id === animeId ? { ...a, favorite: !a.favorite } : a
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  /**
   * Actualiza el estado de un anime
   * @param {string} animeId
   * @param {string} newStatus
   */
  const updateStatusAnime = async (animeId, newStatus) => {
    try {
      await updateMyAnime(animeId, { status: newStatus }, token);
      setAnimes((prev) =>
        prev.map((a) =>
          a._id === animeId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  /**
   * Añade un anime a la lista del usuario
   * @param {Object} anime
   * @returns {Object|null} Nuevo anime agregado
   */
  const addAnime = async (anime) => {
    try {
      await addToMyAnimes(anime._id, token);

      const newAnime = {
        ...anime,
        status: "plan",
        favorite: anime.favorite || false,
        notes: anime.notes || "",
        addedAt: new Date().toISOString(),
      };

      setAnimes((prev) => [...prev, newAnime]);
      return newAnime;
    } catch (err) {
      console.error("Error adding anime:", err);
      return null;
    }
  };

  /**
   * Elimina un anime de la lista local
   * @param {string} animeId
   */
  const removeAnime = (animeId) => {
    setAnimes((prev) => prev.filter((a) => a._id !== animeId));
  };

  // -------------------------
  // RETURN CONTEXT
  // -------------------------
  return (
    <MyAnimesContext.Provider
      value={{
        animes,
        loading,
        fetchAnimes,
        toggleFavorite,
        updateStatus: updateStatusAnime,
        removeAnime,
        addAnime,
      }}
    >
      {children}
    </MyAnimesContext.Provider>
  );
};

/**
 * Hook personalizado para consumir MyAnimesContext
 */
export const useMyAnimes = () => useContext(MyAnimesContext);
