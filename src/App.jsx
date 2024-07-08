import "./App.css";

import React from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import CultureMapComponent from "./Pages/CultureMapComponent";
import HeaderComponent from "./Components/HeaderComponent";
import SportMapComponent from "./Pages/SportMapComponent";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import RozhlednyMapComponent from "./Pages/RozhlednyMapComponent";
import Footer from "./Components/Footer";

// ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <div className="App">
      <div className="main">
        <HeaderComponent />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kulturnimista" element={<CultureMapComponent />} />
          <Route path="/sport" element={<SportMapComponent />} />
          <Route path="/rozhledny" element={<RozhlednyMapComponent />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;
