import React from "react";

function Forecast({ forecast }) {
  return (
    <div className="forecast bg-white shadow-lg rounded-lg p-6 w-full max-w-md mt-4">
      <h2 className="text-xl font-semibold">5-Day Forecast</h2>
      <div className="grid grid-cols-1 gap-4">
        {forecast.list.map(
          (item, index) =>
            index % 8 === 0 && (
              <div
                key={index}
                className="forecast-item bg-gray-200 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">
                    {new Date(item.dt * 1000).toLocaleDateString()}
                  </p>
                  <p>{Math.round(item.main.temp)}°C</p>
                  <p>{item.weather[0].description}</p>
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt={item.weather[0].description}
                  className="w-12 h-12"
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Forecast;
