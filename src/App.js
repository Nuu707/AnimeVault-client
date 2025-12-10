import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SearchProvider } from "./context/SearchContext";
import { MyAnimesProvider } from "./context/MyAnimesContext";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyAnimes from "./pages/MyAnimes";
import FriendList from "./pages/FriendList";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

import PrivateRoute from "./components/PrivateRoute";

import "./css/styles.css";

function App() {
  return (
    <SearchProvider>
      <MyAnimesProvider>
        <Router>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Rutas Privadas */}
            <Route
              path="/dashboard/:id?"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-animes"
              element={
                <PrivateRoute>
                  <MyAnimes />
                </PrivateRoute>
              }
            />

            <Route
              path="/friendlist"
              element={
                <PrivateRoute>
                  <FriendList />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </MyAnimesProvider>
    </SearchProvider>
  );
}

export default App;
