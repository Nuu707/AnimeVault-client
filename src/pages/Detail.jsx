// src/pages/Detail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchAnimeById } from "../api/animeAPI";
import { useMyAnimes } from "../context/MyAnimesContext";
import { useTheme } from "../context/ThemeContext";

const Detail = () => {
  const { id } = useParams();
  const { animes, addAnime, refreshMyAnimes } = useMyAnimes();
  const { theme, toggleTheme } = useTheme();

  const [anime, setAnime] = useState(null);
  const [inMyList, setInMyList] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ---------------------------
  // REFRESH USER DATA
  // ---------------------------
  const refreshUserAnimes = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const user = await res.json();
      setCurrentUser(user);

      const entry = user.animes?.find(
        (a) => a.animeId?._id?.toString() === id || a.animeId?.toString() === id
      );
      setInMyList(!!entry);
    } catch (err) {
      console.error("refreshUserAnimes error:", err);
    }
  }, [id, token]);

  useEffect(() => {
    refreshUserAnimes();
  }, [refreshUserAnimes]);

  // ---------------------------
  // LOAD ANIME DATA
  // ---------------------------
  useEffect(() => {
    let mounted = true;
    const loadAnime = async () => {
      try {
        const found = animes.find((a) => a._id === id);
        const data = found || (await fetchAnimeById(id));
        if (mounted && data) setAnime({ ...data, _id: data._id || id });
      } catch (err) {
        console.error("Error loading anime:", err);
      }
    };
    loadAnime();
    return () => (mounted = false);
  }, [id, animes]);

  // ---------------------------
  // COMMENTS: localStorage
  // ---------------------------
  useEffect(() => {
    if (!anime) return;
    const animeKey = anime._id || id;
    const saved = JSON.parse(localStorage.getItem(`comments_${animeKey}`)) || [];
    setComments(saved);
  }, [anime, id]);

  useEffect(() => {
    if (!anime) return;
    const animeKey = anime._id || id;
    localStorage.setItem(`comments_${animeKey}`, JSON.stringify(comments));
  }, [comments, anime, id]);

  // ---------------------------
  // ADD TO MY LIST
  // ---------------------------
  const handleAddToMyList = async () => {
    if (!anime || addLoading) return;
    try {
      setAddLoading(true);
      await addAnime({ ...anime, status: "plan" });
      await refreshUserAnimes();
      if (refreshMyAnimes) refreshMyAnimes();
    } catch {
      alert("Failed to add to list");
    } finally {
      setAddLoading(false);
    }
  };

  // ---------------------------
  // SUBMIT COMMENT
  // ---------------------------
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!currentUser) return alert("You must be logged in");

    const newComment = {
      id: Date.now(),
      text: comment.trim(),
      date: new Date().toLocaleString(),
      user: currentUser.username,
      avatar: currentUser.avatar || "/assets/profile-pictures/placeholder.png",
    };

    setComments((prev) => [newComment, ...prev]);
    setComment("");
  };

  if (!anime) {
    return (
      <>
        <Navbar onThemeToggle={toggleTheme} theme={theme} showSearchIcon={false} />
        <main className="container section">
          <p>Loading anime...</p>
        </main>
        <Footer />
      </>
    );
  }

  // ---------------------------
  // RENDER DETAIL PAGE
  // ---------------------------
  return (
    <>
      <Navbar theme={theme} onThemeToggle={toggleTheme} showSearchIcon={false} />
      <main className="section" id="anime-detail">
        <div className="container">
          {/* Back Button */}
          <div className="back-button-wrapper">
            <button className="back-button" onClick={() => window.history.back()}>
              ← Back
            </button>
          </div>

          {/* Anime Detail */}
          <div className="detail-card">
            <img src={anime.image} alt={anime.title} className="detail-image" />
            <div className="detail-info">
              <h2>{anime.title}</h2>
              <p>{anime.description}</p>
              <div className="detail-tags">
                <span className="tag">{anime.genre?.join(", ")}</span>
              </div>

              {/* Add to My List */}
              <button
                className="btn-primary btn-sm"
                onClick={handleAddToMyList}
                disabled={inMyList || addLoading}
              >
                {addLoading ? "Adding..." : inMyList ? "In your list" : "Add to my list"}
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="comments-section">
            <h3>Comments</h3>
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                required
              />
              <button type="submit" className="btn-primary btn-sm">
                Submit
              </button>
            </form>

            <div className="comment-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      {c.avatar && <img src={c.avatar} alt={c.user} className="comment-avatar" />}
                      <strong>{c.user}</strong>
                      <span>{c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Detail;
