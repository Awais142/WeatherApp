import React, { useEffect, useState } from "react";
import {
  getWeatherData,
  getForecastData,
  getWeatherDataByLatLon,
} from "./API/api";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search bar input

  useEffect(() => {
    // Get user's location on app load
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("coordinates are :", latitude, longitude);
        fetchWeather(latitude, longitude);
      },
      (error) => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      const searchLocation = searchTerm.trim(); // Trim leading/trailing spaces
      const cityData = await getWeatherData(searchLocation); // Fetch data by city name
      if (cityData) {
        setWeather(cityData);
        const forecastData = await getForecastData(
          `${cityData.coord.lat},${cityData.coord.lon}`
        );
        setForecast(forecastData);
      } else {
        const [lat, lon] = searchLocation.split(",").map(Number); // Parse lat/long
        const weatherData = await getWeatherDataByLatLon(lat, lon); // Fetch data by lat/lon
        setWeather(weatherData);

        const forecastData = await getForecastData(`${lat},${lon}`);
        setForecast(forecastData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    console.log("Lat Lon", lat, lon);
    try {
      setLoading(true);
      const weatherData = await getWeatherDataByLatLon(lat, lon);
      setWeather(weatherData);
      console.log("Weather Data", weatherData);
      const forecastData = await getForecastData(`${lat},${lon}`);
      setForecast(forecastData);
      console.log("Forecast Data", forecastData);
    } catch (error) {
      setError("Unable to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app bg-purple-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-800">
        Weather App
      </h1>
      <form onSubmit={handleSearch} className="flex mb-4 w-full max-w-lg">
        <input
          type="text"
          placeholder="Search by city name"
          className="rounded-l-lg border border-purple-300 px-4 py-2 w-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        weather && (
          <div className="current-weather bg-white shadow-lg rounded-lg p-6 mb-4 w-full max-w-md">
            <h2 className="text-xl font-semibold">{weather.name}</h2>
            <p className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="text-gray-600">{weather.weather[0].description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="w-20 h-20"
            />
            <p className="text-gray-500">Humidity: {weather.main.humidity}%</p>
          </div>
        )
      )}
      {forecast && (
        <div className="forecast bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
          <div className="grid grid-cols-1 gap-4">
            {forecast.list.map(
              (item, index) =>
                index % 8 === 0 && (
                  <div
                    key={index}
                    className="forecast-item bg-gray-200 p-4 rounded-lg"
                  >
                    <p className="font-bold">
                      {new Date(item.dt * 1000).toLocaleDateString()}
                    </p>
                    <p>{Math.round(item.main.temp)}°C</p>
                    <p>{item.weather[0].description}</p>
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
      )}
    </div>
  );
}

export default App;
