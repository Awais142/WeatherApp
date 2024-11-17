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
  FaClock,
} from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { WiSunset } from "react-icons/wi";
import { FiMapPin } from "react-icons/fi";
import Loader from "./Components/Loader";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search bar input

  useEffect(() => {
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

  const getLocalTime = (timezoneOffset) => {
    const now = new Date();
    const localTime = new Date(now.getTime() + timezoneOffset * 1000);
    return localTime.toUTCString().slice(-12, -7); // Convert to local time
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Weather Dashboard
        </h1>

        <form onSubmit={handleSearch} className="flex mb-8 w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search by city name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-lg transition-colors duration-200"
          >
            Search
          </button>
        </form>

        {loading && <Loader />}
        {error && (
          <div className="text-red-500 bg-white/80 rounded-lg p-4 mb-4 text-center">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Weather Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    <FiMapPin className="text-2xl" />
                    {weather.name}
                  </h2>
                  <p className="text-lg opacity-90">{weather.sys.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-lg">{weather.weather[0].description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <FaTemperatureLow className="text-xl" />
                  <div>
                    <p className="text-sm opacity-80">Min</p>
                    <p className="font-semibold">{Math.round(weather.main.temp_min)}°C</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <FaTemperatureHigh className="text-xl" />
                  <div>
                    <p className="text-sm opacity-80">Max</p>
                    <p className="font-semibold">{Math.round(weather.main.temp_max)}°C</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <FaWind className="text-xl" />
                  <div>
                    <p className="text-sm opacity-80">Wind</p>
                    <p className="font-semibold">{weather.wind.speed} m/s</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <MdOutlineWbSunny className="text-xl" />
                  <div>
                    <p className="text-sm opacity-80">Humidity</p>
                    <p className="font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sun Times Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Sun Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaSun className="text-2xl text-yellow-400" />
                      <div>
                        <p className="text-sm opacity-80">Sunrise</p>
                        <p className="font-semibold">
                          {convertUnixToTime(weather.sys.sunrise, weather.timezone)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WiSunset className="text-2xl text-orange-400" />
                      <div>
                        <p className="text-sm opacity-80">Sunset</p>
                        <p className="font-semibold">
                          {convertUnixToTime(weather.sys.sunset, weather.timezone)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <FaClock className="text-xl" />
                  <div>
                    <p className="text-sm opacity-80">Local Time</p>
                    <p className="font-semibold">{getLocalTime(weather.timezone)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Section */}
            {forecast && (
              <div className="col-span-1 md:col-span-2 bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-white">5-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {forecast.list
                    .filter((item, index) => index % 8 === 0)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/10 p-4 rounded-xl text-white text-center"
                      >
                        <p className="font-semibold">
                          {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                        <p className="text-2xl font-bold my-2">
                          {Math.round(item.main.temp)}°C
                        </p>
                        <p className="text-sm opacity-80">
                          {item.weather[0].description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
