const API_URL = "http://localhost:5000/api/friends";

// Obtener solicitudes pendientes
export const getFriendRequests = async (token) => {
  try {
    const res = await fetch(`${API_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener solicitudes");
    return await res.json(); // { requests: [...] }
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Enviar solicitud
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
    if (!res.ok) throw new Error("Error al enviar solicitud");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Aceptar solicitud
export const acceptFriendRequest = async (requestId, token) => {
  try {
    const res = await fetch(`${API_URL}/accept/${requestId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al aceptar solicitud");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Rechazar solicitud
export const rejectFriendRequest = async (requestId, token) => {
  try {
    const res = await fetch(`${API_URL}/reject/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al rechazar solicitud");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Listar amigos
export const getFriendsList = async (token) => {
  try {
    const res = await fetch(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener lista de amigos");
    return await res.json(); // { friends: [...] }
  } catch (err) {
    console.error(err);
    return [];
  }
};
