// src/components/WeatherAlert.jsx
import React from "react";

const WeatherAlert = ({ message }) => {
  return (
    <div className="mt-4 p-2 bg-red-500 text-white rounded">{message}</div>
  );
};

export default WeatherAlert;
