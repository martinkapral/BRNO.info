import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h2>Oops, something went wrong.</h2>
      <Link to="/" className="not-found-button">
        Return to Home
      </Link>
    </div>
  );
}
