// src/api/animeAPI.js

// =====================
// API de ANIMES PÚBLICOS
// =====================

const API_URL = "http://localhost:5000/api/animes";
const USER_URL = "http://localhost:5000/api/user";

// Obtener TODOS los animes
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

// Obtener un anime por ID
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


// =====================
// API DE "MY ANIMES"
// =====================

// Obtener el token
const getToken = () => localStorage.getItem("token");

// Obtener los animes del usuario
export const getMyAnimes = async () => {
  try {
    const response = await fetch(`${USER_URL}/my-animes`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!response.ok) throw new Error("Error al cargar mis animes");

    return await response.json(); // retorna { animes: [...] }
  } catch (error) {
    console.error("Error al obtener mis animes:", error);
    return { animes: [] };
  }
};

// Añadir un anime a "my-animes"
export const addToMyAnimes = async (animeId) => {
  try {
    const response = await fetch(`${USER_URL}/my-animes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ animeId }),
    });

    if (!response.ok) throw new Error("Error al añadir anime");

    return await response.json();
  } catch (error) {
    console.error("Error al añadir anime:", error);
    return null;
  }
};

// Actualizar estado, score o notes
export const updateMyAnime = async (animeId, data) => {
  try {
    const response = await fetch(`${USER_URL}/my-animes/${animeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al actualizar anime");

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar mi anime:", error);
    return null;
  }
};

// Eliminar un anime de tu lista
export const deleteMyAnime = async (animeId) => {
  try {
    const response = await fetch(`${USER_URL}/my-animes/${animeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
    });

    if (!response.ok) throw new Error("Error al eliminar anime");

    return await response.json();
  } catch (error) {
    console.error("Error al eliminar mi anime:", error);
    return null;
  }
};

export default fetchAnimes;
