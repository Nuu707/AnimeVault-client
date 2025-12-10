import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FriendCard from "../components/FriendCard";
import FriendRequests from "../components/FriendRequests";
import { useTheme } from "../context/ThemeContext";

const API_URL = "http://localhost:5000/api/friends";
const USERS_API = "http://localhost:5000/api/user";

const FriendList = () => {
  const { theme, toggleTheme } = useTheme();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const token = localStorage.getItem("token");
  const loggedUserId = localStorage.getItem("userId");

  // --- Load friends and sent requests ---
  const loadFriends = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error fetching friends");

      const data = await res.json();
      setFriends(data.friends || []);

      const sentRes = await fetch(`${API_URL}/sent-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!sentRes.ok) throw new Error("Error fetching sent requests");

      const sentData = await sentRes.json();
      setSentRequests(
        (sentData.sentRequests || []).map((req) => req.to?._id?.toString() || "")
      );
    } catch (err) {
      console.error("⚠️ loadFriends error:", err);
    }
  }, [token]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  // --- Search users ---
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return setSearchResults([]);

    try {
      const res = await fetch(
        `${USERS_API}/search?q=${encodeURIComponent(searchTerm)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Error searching users");

      const data = await res.json();

      const filtered = (data.users || []).filter((user) => {
        if (!user?._id) return false;
        const id = user._id.toString();
        const isFriend = friends.some((f) => f?._id?.toString() === id);
        const isSent = sentRequests.includes(id);
        const isSelf = id === loggedUserId;
        return !isFriend && !isSent && !isSelf;
      });

      setSearchResults(filtered);
    } catch (err) {
      console.error("⚠️ handleSearch error:", err);
      setSearchResults([]);
    }
  };

  // --- Send friend request ---
  const sendFriendRequest = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toUserId: userId }),
      });

      if (!res.ok) throw new Error("Error sending request");

      alert("Friend request sent successfully");
      setSentRequests((prev) => [...prev, userId]);
    } catch (err) {
      console.error("⚠️ sendFriendRequest error:", err);
      alert("Failed to send friend request");
    }
  };

  // --- Remove friend from UI ---
  const handleRemoveFriend = (friendId) => {
    setFriends((prev) =>
      prev.filter((f) => f?._id?.toString() !== friendId.toString())
    );
  };

  return (
    <>
      <Navbar onThemeToggle={toggleTheme} theme={theme} showSearchIcon={false} />

      <main className="container section friend-list">
        <div className="section-header">
          <h2>Pending Requests</h2>
        </div>

        <FriendRequests onUpdateFriends={loadFriends} />

        <div className="section-header" style={{ marginTop: "40px" }}>
          <h2>Search New Friends</h2>
        </div>

        <form className="friend-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="grid friend-grid" style={{ marginTop: "20px" }}>
            {searchResults.map((user) => (
              <div key={user._id} className="card friend-card">
                <img
                  src={user.avatar || "/assets/profile-pictures/placeholder.png"}
                  alt={user.username}
                />
                <div className="card-body">
                  <h3>{user.username}</h3>

                  <button
                    className="btn-primary"
                    onClick={() => sendFriendRequest(user._id)}
                    disabled={sentRequests.includes(user._id?.toString())}
                  >
                    {sentRequests.includes(user._id?.toString())
                      ? "Request Sent"
                      : "Send Request"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-header" style={{ marginTop: "40px" }}>
          <h2>Friends List</h2>
        </div>

        {friends.length === 0 ? (
          <p>You have no friends yet.</p>
        ) : (
          <div className="grid friend-grid">
            {friends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                onRemove={handleRemoveFriend}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default FriendList;
