// src/pages/Contact.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const Contact = () => {
  const { theme, toggleTheme } = useTheme();

  // --- Form state ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // --- Submission status ---
  const [status, setStatus] = useState(""); // "", "success", "error"

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(""); // reset

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        console.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Error sending the form:", err);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar 
        onThemeToggle={toggleTheme} 
        theme={theme} 
        showSearchIcon={false} // hide search icon on Contact page
      />

      <main className="section contact-page container">
        <div className="section-header">
          <h2>Contact</h2>
        </div>

        <p className="contact-text">
          If you have any questions, suggestions, or inquiries about the project, please fill out the form below.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="yourname@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary full">
            Send Message
          </button>

          {status === "success" && (
            <p className="success">✅ Message sent successfully.</p>
          )}
          {status === "error" && (
            <p className="error">❌ There was an error sending your message.</p>
          )}
        </form>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
