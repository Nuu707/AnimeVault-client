// src/components/Hero.jsx
import React, { useEffect, useState } from "react";

/**
 * Componente Hero con slider de imágenes y contenido destacado.
 * Cambia automáticamente de slide cada 5 segundos.
 */
const Hero = () => {
  // Lista de imágenes del slider
  const slides = [
    "/assets/banner/01.jpg",
    "/assets/banner/02.jpg",
    "/assets/banner/03.jpg",
    "/assets/banner/04.jpg",
    "/assets/banner/05.jpg",
    "/assets/banner/06.jpg",
    "/assets/banner/07.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Efecto: cambia de slide automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    // Cleanup al desmontar el componente
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="container">
        {/* Hero slider */}
        <div className="hero-slider">
          {slides.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{
                backgroundImage: `url(${image})`,
                transition: "opacity 1s ease-in-out",
              }}
            ></div>
          ))}
        </div>

        {/* Hero content */}
        <div className="hero-content">
          <h1 className="title">Discover Your Next Favorite Anime</h1>
          <p className="lead">
            Explore recommendations, save your series, and manage your own list.
          </p>
          <a href="/gallery" className="btn-primary">
            Explore gallery
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
