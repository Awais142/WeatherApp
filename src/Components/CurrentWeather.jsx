// src/components/CurrentWeather.jsx
import React from "react";

const CurrentWeather = ({ data, unit, addToFavorites }) => {
  const { name, main, weather, wind } = data;

  return (
    <div className="mt-4 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-lg">
        {Math.round(main.temp)}°{unit === "metric" ? "C" : "F"} -{" "}
        {weather[0].description}
      </p>
      <p>Humidity: {main.humidity}%</p>
      <p>Wind Speed: {wind.speed} m/s</p>
      <button
        onClick={() => addToFavorites(name)}
        className="mt-2 p-2 bg-green-500 text-white rounded"
      >
        Add to Favorites
      </button>
    </div>
  );
};

export default CurrentWeather;
