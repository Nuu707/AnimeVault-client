// src/pages/Register.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom"; // Usamos Link para SPA
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // ---------------------- Form state ----------------------
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // ---------------------- Handle form submission ----------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // --- Basic client-side validation ---
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // --- Send registration request ---
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      // --- Save token and navigate to dashboard ---
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server connection error.");
    }
  };

  return (
    <>
      {/* Navbar without search icon */}
      <Navbar onThemeToggle={toggleTheme} theme={theme} showSearchIcon={false} />

      <main className="auth-container">
        <div className="auth-card">
          <h2>Register</h2>

          {/* ---------------------- Registration Form ---------------------- */}
          <form onSubmit={handleRegister} className="auth-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Error message */}
            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn-primary">
              Register
            </button>
          </form>

          {/* Switch to login */}
          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Register;
