// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

/**
 * Página de Dashboard
 * Permite al usuario ver su perfil, editarlo, gestionar lista de animes y amigos.
 * Si se proporciona un `id` por params, muestra el perfil de otro usuario (solo lectura).
 */
const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    avatar: "/assets/profile-pictures/placeholder.png",
    password: "",
  });
  const [profileAnimes, setProfileAnimes] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // -------------------------
  // ELIMINAR CUENTA
  // -------------------------
  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm(
      "⚠️ Are you sure you want to delete your account? This action is permanent."
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      "❗ Last warning: your profile, anime list, and data will be deleted. Continue?"
    );
    if (!confirm2) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error deleting user");

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      alert("Your account has been deleted.");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete your account.");
    }
  };

  // -------------------------
  // CARGAR PERFIL Y ANIMES
  // -------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = id
          ? `http://localhost:5000/api/user/${id}`
          : `http://localhost:5000/api/user/me`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error fetching profile");
        const data = await res.json();
        setProfileData({
          username: data.username || "",
          email: data.email || "",
          avatar: data.avatar || "/assets/profile-pictures/placeholder.png",
          password: "",
        });
        setProfileAnimes(data.animes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id, token]);

  // -------------------------
  // SELECCIÓN DE AVATAR
  // -------------------------
  const handleAvatarSelect = (avatar) =>
    setProfileData({ ...profileData, avatar: `/assets/profile-pictures/${avatar}` });

  // -------------------------
  // GUARDAR PERFIL
  // -------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
          avatar: profileData.avatar,
          ...(profileData.password ? { password: profileData.password } : {}),
        }),
      });
      if (!res.ok) throw new Error("Error updating profile");
      await res.json();
      setProfileData({ ...profileData, password: "" });
      setEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // -------------------------
  // ESTADÍSTICAS DE ANIMES
  // -------------------------
  const mapStatus = (status) => {
    switch ((status || "").toLowerCase()) {
      case "watching":
        return "Watching";
      case "completed":
        return "Completed";
      case "on-hold":
      case "onhold":
        return "On-Hold";
      case "dropped":
        return "Dropped";
      case "plan":
      case "plan to watch":
      default:
        return "Plan to watch";
    }
  };

  const getStats = () => {
    const states = {
      Watching: 0,
      Completed: 0,
      "On-Hold": 0,
      Dropped: 0,
      "Plan to watch": 0,
    };

    profileAnimes.forEach((a) => {
      const status = mapStatus(a.status);
      states[status] += 1;
    });

    return { ...states, totalEntries: profileAnimes.length, days: 0 };
  };

  const stats = getStats();

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      <Navbar onThemeToggle={toggleTheme} theme={theme} showSearchIcon={false} />

      <main className="container section dashboard-layout">
        {/* Columna de perfil */}
        <div className="profile-column">
          {!editing || id ? (
            <section id="profile">
              <h3>{id ? `${profileData.username} - Profile` : "My Profile"}</h3>
              <div id="avatar-container">
                <img
                  id="dashboard-avatar"
                  className="avatar-preview"
                  src={profileData.avatar}
                  alt="User Avatar"
                />
              </div>
              <p><strong>Name:</strong> {profileData.username}</p>
              <p><strong>Email:</strong> {profileData.email}</p>

              {!id && (
                <div className="profile-buttons">
                  <button className="btn-primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                  <button className="btn-secondary" onClick={() => navigate("/my-animes")}>
                    📋 Anime List
                  </button>
                  <button className="btn-secondary" onClick={() => navigate("/friendlist")}>
                    👥 Friend List
                  </button>
                  <button
                    className="btn-danger"
                    style={{ backgroundColor: "#b00020", color: "white" }}
                    onClick={handleDeleteAccount}
                  >
                    ❌ Delete My Account
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section id="edit-profile">
              <h3>Edit Profile</h3>
              <form onSubmit={handleSaveProfile}>
                <div className="avatar-section">
                  <img
                    id="user-avatar-edit"
                    className="avatar-preview"
                    src={profileData.avatar}
                    alt="User Avatar"
                  />
                  <p>Select your avatar:</p>
                  <div className="avatar-options">
                    {[
                      "01.jpg","02.jpg","03.jpg","04.jpg","05.jpg","06.jpg","07.jpg",
                      "08.jpg","09.jpg","10.jpg","11.jpg","12.jpg","13.jpg"
                    ].map((avatar) => (
                      <img
                        key={avatar}
                        className={`avatar-choice ${
                          profileData.avatar.includes(avatar) ? "selected" : ""
                        }`}
                        src={`/assets/profile-pictures/${avatar}`}
                        alt={`Avatar ${avatar}`}
                        onClick={() => handleAvatarSelect(avatar)}
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({ ...profileData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) =>
                      setProfileData({ ...profileData, password: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </form>
            </section>
          )}
        </div>

        {/* Columna de estadísticas y favoritos */}
        <div className="dashboard-column">
          <section id="stats">
            <h3>Statistics</h3>
            <div className="status-stats">
              {[
                { label: "Watching", value: stats["Watching"] },
                { label: "Completed", value: stats["Completed"] },
                { label: "On-Hold", value: stats["On-Hold"] },
                { label: "Dropped", value: stats["Dropped"] },
                { label: "Plan to watch", value: stats["Plan to watch"] },
                { label: "Total Entries", value: stats.totalEntries },
              ].map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="favorites">
            <h3>Favorites</h3>
            <div className="favorites-container">
              {profileAnimes.filter((a) => a.favorite).length === 0 ? (
                <p>No favorites yet.</p>
              ) : (
                profileAnimes
                  .filter((a) => a.favorite)
                  .map((a) => (
                    <div key={a._id} className="fav-card">
                      <img
                        src={
                          a.animeId?.image?.replace("../assets", "/assets") ||
                          "/assets/profile-pictures/placeholder.png"
                        }
                        alt={a.animeId?.title || "Anime"}
                      />
                      <p>{a.animeId?.title}</p>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Dashboard;
