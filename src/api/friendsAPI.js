// src/api/friendsAPI.js

// ===================================
// API DE AMISTADES (solicitudes y lista)
// ===================================

const API_URL = "http://localhost:5000/api/friends";

/**
 * Obtiene todas las solicitudes de amistad pendientes del usuario.
 * @param {string} token - JWT del usuario autenticado.
 * @returns {Promise<Array>} Lista de solicitudes o [] si falla.
 */
export const getFriendRequests = async (token) => {
  try {
    const res = await fetch(`${API_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener solicitudes");
    }

    return await res.json(); // { requests: [...] }
  } catch (err) {
    console.error("Error en getFriendRequests:", err);
    return [];
  }
};

/**
 * Envía una solicitud de amistad a otro usuario.
 * @param {string} toUserId - ID del usuario al que se envía la solicitud.
 * @param {string} token - JWT del usuario autenticado.
 * @returns {Promise<Object|null>} Datos de la solicitud creada.
 */
export const sendFriendRequest = async (toUserId, token) => {
  try {
    const res = await fetch(`${API_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toUserId }),
    });

    if (!res.ok) {
      throw new Error("Error al enviar solicitud");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en sendFriendRequest:", err);
    return null;
  }
};

/**
 * Acepta una solicitud de amistad pendiente.
 * @param {string} requestId - ID de la solicitud a aceptar.
 * @param {string} token - JWT del usuario autenticado.
 * @returns {Promise<Object|null>} Resultado del backend.
 */
export const acceptFriendRequest = async (requestId, token) => {
  try {
    const res = await fetch(`${API_URL}/accept/${requestId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al aceptar solicitud");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en acceptFriendRequest:", err);
    return null;
  }
};

/**
 * Rechaza una solicitud de amistad.
 * @param {string} requestId - ID de la solicitud a rechazar.
 * @param {string} token - JWT del usuario autenticado.
 * @returns {Promise<Object|null>} Resultado del backend.
 */
export const rejectFriendRequest = async (requestId, token) => {
  try {
    const res = await fetch(`${API_URL}/reject/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al rechazar solicitud");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en rejectFriendRequest:", err);
    return null;
  }
};

/**
 * Obtiene la lista de amigos del usuario autenticado.
 * @param {string} token - JWT.
 * @returns {Promise<Array>} Lista de amigos o [] si falla.
 */
export const getFriendsList = async (token) => {
  try {
    const res = await fetch(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener lista de amigos");
    }

    return await res.json(); // { friends: [...] }
  } catch (err) {
    console.error("Error en getFriendsList:", err);
    return [];
  }
};
