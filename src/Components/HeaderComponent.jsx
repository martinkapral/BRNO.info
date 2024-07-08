import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const HeaderComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const activeStyles = {
    fontWeight: "600",
    textDecoration: "underline",
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="dropdown">
        <Link to="/" className="title">
          BRNO.info
        </Link>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={handleNavClick}
          >
            Domů
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/kulturnimista"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={handleNavClick}
          >
            Kulturní místa
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sport"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={handleNavClick}
          >
            Sport
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/rozhledny"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={handleNavClick}
          >
            Rozhledny
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/plochyzelene"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={handleNavClick}
          >
            Plochy zeleně
          </NavLink>
        </li> */}
      </ul>
    </nav>
  );
};

export default HeaderComponent;
