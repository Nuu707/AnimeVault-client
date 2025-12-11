// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// Crear el contexto del tema (light / dark)
export const ThemeContext = createContext();

/**
 * Hook personalizado para consumir ThemeContext
 * @returns {{ theme: string, toggleTheme: function }}
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Proveedor de contexto para el tema de la aplicación
 * Permite alternar entre modo claro y oscuro, persistiendo la preferencia en localStorage.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Inicializar tema desde localStorage al montar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
  }, []);

  /**
   * Alterna el tema entre "light" y "dark"
   * Actualiza el body y guarda la preferencia en localStorage
   */
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
