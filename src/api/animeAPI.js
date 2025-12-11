// src/api/animeAPI.js

// ======================================================
// API DE ANIMES PÚBLICOS Y "MY ANIMES" (USUARIO LOGUEADO)
// ======================================================

// Endpoints base del backend
const API_URL = "http://localhost:5000/api/animes";
const USER_URL = "http://localhost:5000/api/user";

// =============================
// 🔸 ANIMES PÚBLICOS (sin auth)
// =============================

/**
 * Obtiene la lista completa de animes públicos.
 * @returns {Promise<Array>} Array de animes o [] si ocurre un error.
 */
export const fetchAnimes = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener los animes:", error);
    return [];
  }
};

/**
 * Obtiene la información de un anime específico por ID.
 * @param {string} id - ID del anime.
 * @returns {Promise<Object|null>} Objeto del anime o null si falla.
 */
export const fetchAnimeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener anime por ID: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener el anime:", error);
    return null;
  }
};

// ==============================
// 🔸 "MY ANIMES" (requiere auth)
// ==============================

/**
 * Obtiene el JWT almacenado en localStorage.
 * @returns {string|null} Token o null.
 */
const getToken = () => localStorage.getItem("token");

/**
 * Obtiene los animes guardados en la lista personal del usuario.
 * @returns {Promise<{animes: Array}>} Array dentro de un objeto { animes }.
 */
export const getMyAnimes = async () => {
  try {
    const response = await fetch(`${USER_URL}/my-animes`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar mis animes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener mis animes:", error);
    return { animes: [] };
  }
};

/**
 * Añade un anime a la lista personal del usuario.
 * @param {string} animeId - ID del anime a añadir.
 * @returns {Promise<Object|null>} Datos del anime añadido.
 */
export const addToMyAnimes = async (animeId) => {
  try {
    const response = await fetch(`${USER_URL}/my-animes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ animeId }),
    });

    if (!response.ok) {
      throw new Error("Error al añadir anime");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al añadir anime:", error);
    return null;
  }
};

/**
 * Actualiza datos de un anime en "my animes" (estado, score o notes).
 * @param {string} animeId - ID del anime.
 * @param {Object} data - Objeto con los campos a actualizar.
 * @returns {Promise<Object|null>} Anime actualizado o null.
 */
export const updateMyAnime = async (animeId, data) => {
  try {
    const response = await fetch(`${USER_URL}/my-animes/${animeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar anime");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar mi anime:", error);
    return null;
  }
};

/**
 * Elimina un anime de la lista personal del usuario.
 * @param {string} animeId - ID del anime a eliminar.
 * @returns {Promise<Object|null>} Result del backend o null.
 */
export const deleteMyAnime = async (animeId) => {
  try {
    const response = await fetch(`${USER_URL}/my-animes/${animeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar anime");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al eliminar mi anime:", error);
    return null;
  }
};

export default fetchAnimes;
