import React from "react";

function WeatherAlert({ error }) {
  return error ? (
    <div className="alert bg-red-100 text-red-700 p-4 rounded-lg w-full max-w-md mb-4">
      {error}
    </div>
  ) : null;
}

export default WeatherAlert;
