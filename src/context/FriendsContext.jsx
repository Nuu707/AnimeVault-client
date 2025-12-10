import { createContext, useContext, useEffect, useState } from "react";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchFriends = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data.friends || []);
    } catch (err) {
      console.error("Error fetching friends", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data.pendingRequests || []);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

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
      console.error("Error sending request", err);
    }
  };

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
      fetchFriends();
      fetchRequests();
      return data;
    } catch (err) {
      console.error("Error accepting request", err);
    }
  };

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
      fetchRequests();
      return data;
    } catch (err) {
      console.error("Error rejecting request", err);
    }
  };

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

export const useFriends = () => useContext(FriendsContext);
