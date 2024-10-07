import React, { useEffect, useState } from "react";
import {
  getWeatherData,
  getForecastData,
  getWeatherDataByLatLon,
} from "./API/api";
import {
  FaTemperatureLow,
  FaTemperatureHigh,
  FaWind,
  FaSun,
} from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { WiSunset } from "react-icons/wi";
import { FiMapPin } from "react-icons/fi";

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
    try {
      setLoading(true);
      const weatherData = await getWeatherDataByLatLon(lat, lon);
      setWeather(weatherData);
      const forecastData = await getForecastData(`${lat},${lon}`);
      setForecast(forecastData);
    } catch (error) {
      setError("Unable to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to convert UNIX timestamp to readable time
  const convertUnixToTime = (unixTime, timezoneOffset) => {
    const date = new Date((unixTime + timezoneOffset) * 1000);
    return date.toUTCString().slice(-12, -7); // Extract only time in HH:MM format
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
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiMapPin className="text-purple-600" />
              {weather.name}, {weather.sys.country}
            </h2>
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-col items-center">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt={weather.weather[0].description}
                  className="w-20 h-20"
                />
                <p className="text-gray-600 capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
              <p className="text-5xl font-bold">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>
            <div className="flex justify-around mt-4">
              <div className="flex items-center gap-2">
                <FaTemperatureLow className="text-blue-600" />
                <p>Min: {Math.round(weather.main.temp_min)}°C</p>
              </div>
              <div className="flex items-center gap-2">
                <FaTemperatureHigh className="text-red-600" />
                <p>Max: {Math.round(weather.main.temp_max)}°C</p>
              </div>
            </div>
            <div className="flex justify-around mt-4">
              <div className="flex items-center gap-2">
                <FaWind className="text-gray-600" />
                <p>Wind: {weather.wind.speed} m/s</p>
              </div>
              <div className="flex items-center gap-2">
                <MdOutlineWbSunny className="text-yellow-600" />
                <p>
                  Sunrise:{" "}
                  {convertUnixToTime(weather.sys.sunrise, weather.timezone)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <WiSunset className="text-orange-600" />
                <p>
                  Sunset:{" "}
                  {convertUnixToTime(weather.sys.sunset, weather.timezone)}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {forecast && (
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
      )}
    </div>
  );
}

export default App;
