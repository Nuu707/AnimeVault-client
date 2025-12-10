import React, { useEffect, useState } from "react";

const Hero = () => {
  const slides = [
    "/assets/banner/Sasaki-and-Miyano-Wallpaper.jpg",
    "/assets/banner/descarga.jpg",
    "/assets/banner/Orange.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval); // clean up on unmount
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
