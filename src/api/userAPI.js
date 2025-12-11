// src/api/userAPI.js

// ==========================================
// API DEL USUARIO: MY-ANIMES Y FAVORITOS
// ==========================================

const API_URL = "http://localhost:5000/api/user";

/**
 * Obtiene la lista de animes del usuario logueado ("my-animes").
 * @param {string} token - JWT del usuario.
 * @returns {Promise<Array>} Array de animes o [] si ocurre un error.
 */
export const getMyAnimes = async (token) => {
  try {
    const res = await fetch(`${API_URL}/my-animes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Error al obtener my-animes");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en getMyAnimes:", err);
    return [];
  }
};

/**
 * Añade un anime a la lista del usuario.
 * @param {string} animeId - ID del anime.
 * @param {string} token - JWT del usuario.
 * @param {Object} extra - Información adicional opcional (status, score, notes...).
 * @returns {Promise<Object|null>} Datos del anime añadido o null.
 */
export const addToMyAnimes = async (animeId, token, extra = {}) => {
  try {
    const res = await fetch(`${API_URL}/my-animes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ animeId, ...extra }),
    });

    if (!res.ok) {
      throw new Error("Error al añadir anime");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en addToMyAnimes:", err);
    return null;
  }
};

/**
 * Actualiza un anime del usuario (estado, favorito, score, notes...).
 * @param {string} animeId - ID del anime.
 * @param {Object} data - Campos a actualizar.
 * @param {string} token - JWT del usuario.
 * @returns {Promise<Object|null>} Anime actualizado o null.
 */
export const updateMyAnime = async (animeId, data, token) => {
  try {
    const res = await fetch(`${API_URL}/my-animes/${animeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar anime");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en updateMyAnime:", err);
    return null;
  }
};

/**
 * Alterna el estado "favorito" de un anime en la lista personal.
 * @param {string} animeId - ID del anime.
 * @param {string} token - JWT del usuario.
 * @returns {Promise<Object|null>} Resultado del backend.
 */
export const toggleFavorite = async (animeId, token) => {
  try {
    const res = await fetch(`${API_URL}/favorite/${animeId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al togglear favorito");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en toggleFavorite:", err);
    return null;
  }
};

/**
 * Elimina un anime de la lista personal del usuario.
 * @param {string} animeId - ID del anime.
 * @param {string} token - JWT del usuario.
 * @returns {Promise<Object|null>} Resultado del backend.
 */
export const deleteMyAnime = async (animeId, token) => {
  try {
    const res = await fetch(`${API_URL}/my-animes/${animeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Error al eliminar anime");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en deleteMyAnime:", err);
    return null;
  }
};
