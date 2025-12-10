const API_URL = "http://localhost:5000/api/user";

// Obtener lista de my-animes del usuario
export const getMyAnimes = async (token) => {
  try {
    const res = await fetch(`${API_URL}/my-animes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al obtener my-animes");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Añadir anime a my-animes (sin rating)
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
    if (!res.ok) throw new Error("Error al añadir anime");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Actualizar anime (solo estado o favorito ahora)
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
    if (!res.ok) throw new Error("Error al actualizar anime");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Toggle favorito
export const toggleFavorite = async (animeId, token) => {
  try {
    const res = await fetch(`${API_URL}/favorite/${animeId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al togglear favorito");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Eliminar anime de my-animes
export const deleteMyAnime = async (animeId, token) => {
  try {
    const res = await fetch(`${API_URL}/my-animes/${animeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al eliminar anime");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
