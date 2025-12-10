// src/components/FriendCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/friends";

export default function FriendCard({ friend, onRemove }) {
  const navigate = useNavigate();
  const { _id, username, avatar } = friend;

  // Remove friend
  const handleRemove = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error removing friend");
      if (onRemove) onRemove(_id); // notify parent
    } catch (err) {
      console.error(err);
      alert("Could not remove friend");
    }
  };

  // View friend's profile
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
