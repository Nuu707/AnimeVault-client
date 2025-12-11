// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

/**
 * Componente que protege rutas privadas.
 * Solo permite el acceso si existe un token en localStorage.
 * 
 * @param {React.ReactNode} children - Componente(s) a renderizar si el usuario está autenticado.
 * @returns {React.ReactNode} Children si autenticado, si no redirige a /login
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si no hay token → redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token → permitir acceso
  return children;
};

export default PrivateRoute;
