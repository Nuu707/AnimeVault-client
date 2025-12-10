import React, { useEffect, useState } from "react";
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../api/friendsAPI";

function FriendRequests({ onUpdateFriends }) {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const loadRequests = async () => {
    try {
      const data = await getFriendRequests(token);
      // Using pendingRequests according to backend
      if (data.pendingRequests) setRequests(data.pendingRequests);
    } catch (err) {
      console.error("Error loading friend requests:", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id, token);
      await loadRequests();
      if (onUpdateFriends) onUpdateFriends();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id, token);
      await loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="friend-requests-container">
      {requests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="friend-request-card">
            <img
              src={req.from?.avatar || "/assets/profile-pictures/placeholder.png"}
              alt={req.from?.username ? `Avatar of ${req.from.username}` : "User"}
              className="friend-avatar"
            />
            <p>
              <strong>{req.from?.username || "User"}</strong> wants to be your friend
            </p>
            <div className="friend-request-buttons">
              <button className="btn-accept" onClick={() => handleAccept(req._id)}>
                Accept
              </button>
              <button className="btn-reject" onClick={() => handleReject(req._id)}>
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendRequests;
