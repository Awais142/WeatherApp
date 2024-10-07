// src/components/Favorites.jsx
import React from "react";

const Favorites = ({ favorites }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Favorite Locations</h2>
      <ul>
        {favorites.map((city, index) => (
          <li key={index} className="mt-1">
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
