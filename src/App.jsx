import React, { useEffect, useState } from "react";
import {
  getWeatherData,
  getForecastData,
  getWeatherDataByLatLon,
  getAirQualityData,
  getAQIDescription,
} from "./API/api";
import { WiThermometer, WiThermometerExterior, WiStrongWind, WiSunrise, WiSunset, WiBarometer, WiHumidity, WiTime3 } from "react-icons/wi";
import { MdOutlineLocationOn, MdSearch, MdAir } from "react-icons/md";
import { TbUvIndex } from "react-icons/tb";
import { BsDroplet } from "react-icons/bs";
import Loader from "./Components/Loader";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
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
      const airQualityData = await getAirQualityData(lat, lon);
      setAirQuality(airQualityData);
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-lg transition-colors duration-200 flex items-center gap-2"
          >
            <MdSearch className="text-xl" />
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
                    <MdOutlineLocationOn className="text-2xl" />
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
                  <WiThermometerExterior className="text-3xl text-blue-300" />
                  <div>
                    <p className="text-sm opacity-80">Min</p>
                    <p className="font-semibold">{Math.round(weather.main.temp_min)}°C</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <WiThermometer className="text-3xl text-red-300" />
                  <div>
                    <p className="text-sm opacity-80">Max</p>
                    <p className="font-semibold">{Math.round(weather.main.temp_max)}°C</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <WiStrongWind className="text-3xl text-gray-300" />
                  <div>
                    <p className="text-sm opacity-80">Wind</p>
                    <p className="font-semibold">{weather.wind.speed} m/s</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center gap-2">
                  <WiHumidity className="text-3xl text-cyan-300" />
                  <div>
                    <p className="text-sm opacity-80">Humidity</p>
                    <p className="font-semibold">{weather.main.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Air Quality Card */}
            {airQuality && (
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <MdAir className="text-2xl text-green-400" />
                    Air Quality Index
                  </h3>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  {airQuality.list && airQuality.list[0] && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-2xl font-bold ${getAQIDescription(airQuality.list[0].main.aqi).color}`}>
                            {getAQIDescription(airQuality.list[0].main.aqi).level}
                          </p>
                          <p className="text-sm opacity-80">
                            {getAQIDescription(airQuality.list[0].main.aqi).description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold">
                            {airQuality.list[0].main.aqi}
                          </p>
                          <p className="text-sm opacity-80">AQI Value</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm opacity-80">Components</p>
                          <div className="space-y-2 mt-2">
                            <p className="flex items-center gap-2">
                              <WiBarometer className="text-xl" />
                              CO: {airQuality.list[0].components.co} μg/m³
                            </p>
                            <p className="flex items-center gap-2">
                              <TbUvIndex className="text-xl" />
                              NO2: {airQuality.list[0].components.no2} μg/m³
                            </p>
                            <p className="flex items-center gap-2">
                              <BsDroplet className="text-xl" />
                              O3: {airQuality.list[0].components.o3} μg/m³
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm opacity-80">Additional</p>
                          <div className="space-y-2 mt-2">
                            <p>PM2.5: {airQuality.list[0].components.pm2_5} μg/m³</p>
                            <p>PM10: {airQuality.list[0].components.pm10} μg/m³</p>
                            <p>SO2: {airQuality.list[0].components.so2} μg/m³</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sun Times Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Sun Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WiSunrise className="text-3xl text-yellow-400" />
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
                      <WiSunset className="text-3xl text-orange-400" />
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
                  <WiTime3 className="text-3xl" />
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
