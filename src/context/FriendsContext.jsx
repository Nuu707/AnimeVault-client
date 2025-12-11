// src/context/FriendsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const FriendsContext = createContext();

/**
 * Proveedor de contexto para la gestión de amigos y solicitudes de amistad.
 * Permite acceder a:
 *  - Lista de amigos
 *  - Solicitudes pendientes
 *  - Enviar, aceptar y rechazar solicitudes
 */
export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  /**
   * Obtiene la lista de amigos del usuario.
   */
  const fetchFriends = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data.friends || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  /**
   * Obtiene las solicitudes de amistad pendientes.
   */
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data.pendingRequests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  /**
   * Envía una solicitud de amistad a otro usuario.
   * @param {string} toUserId - ID del usuario al que enviar la solicitud
   */
  const sendRequest = async (toUserId) => {
    try {
      const res = await fetch("http://localhost:5000/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toUserId }),
      });
      return await res.json();
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  /**
   * Acepta una solicitud de amistad y actualiza listas.
   * @param {string} requestId - ID de la solicitud a aceptar
   */
  const acceptRequest = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/friends/accept/${requestId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      await Promise.all([fetchFriends(), fetchRequests()]);
      return data;
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  /**
   * Rechaza una solicitud de amistad y actualiza la lista de solicitudes.
   * @param {string} requestId - ID de la solicitud a rechazar
   */
  const rejectRequest = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/friends/reject/${requestId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      await fetchRequests();
      return data;
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  // Carga inicial de amigos y solicitudes cuando existe token
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);
      await Promise.all([fetchFriends(), fetchRequests()]);
      setLoading(false);
    };

    load();
  }, [token]);

  return (
    <FriendsContext.Provider
      value={{
        friends,
        requests,
        loading,
        fetchFriends,
        fetchRequests,
        sendRequest,
        acceptRequest,
        rejectRequest,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

/**
 * Hook personalizado para consumir FriendsContext
 */
export const useFriends = () => useContext(FriendsContext);
