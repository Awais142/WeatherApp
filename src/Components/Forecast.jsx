// src/components/Forecast.jsx
import React from "react";

const Forecast = ({ data, unit }) => {
  const days = data.list.filter((_, index) => index % 8 === 0); // Filter for daily forecasts

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {days.map((day) => {
        const date = new Date(day.dt * 1000);
        return (
          <div key={day.dt} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{date.toLocaleDateString()}</h3>
            <p>
              Temp: {Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}
            </p>
            <p>Condition: {day.weather[0].description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
