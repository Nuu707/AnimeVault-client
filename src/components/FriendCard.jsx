// src/components/FriendCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/friends";

/**
 * Tarjeta individual que muestra información básica de un amigo.
 * Permite:
 *  - Ver su perfil
 *  - Eliminarlo de la lista de amigos
 */
export default function FriendCard({ friend, onRemove }) {
  const navigate = useNavigate();
  const { _id, username, avatar } = friend;

  /**
   * Elimina al amigo actual desde el backend.
   * Notifica al componente padre mediante `onRemove` si la acción es exitosa.
   */
  const handleRemove = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Error removing friend");
      }

      // Notifica al padre para actualizar la UI
      if (onRemove) {
        onRemove(_id);
      }
    } catch (err) {
      console.error("Error removing friend:", err);
      alert("Could not remove friend");
    }
  };

  /**
   * Navega al perfil del amigo.
   */
  const handleViewProfile = () => {
    navigate(`/dashboard/${_id}`);
  };

  return (
    <div className="card friend-card">
      <img
        src={avatar || "/assets/profile-pictures/placeholder.png"}
        alt={`Avatar of ${username}`}
      />

      <div className="card-body">
        <h3>{username}</h3>

        <div className="card-row">
          <button className="btn-primary" onClick={handleViewProfile}>
            View Profile
          </button>

          <button className="btn-danger" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
