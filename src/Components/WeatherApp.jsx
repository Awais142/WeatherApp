import React, { useEffect, useState } from "react";
import {
  getWeatherData,
  getForecastData,
  getWeatherDataByLatLon,
} from "./API/api";
import SearchBar from "./Components/SearchBar";
import CurrentWeather from "./Components/CurrentWeather";
import Forecast from "./Components/Forecast";
import WeatherAlert from "./Components/WeatherAlert";
import Loader from "./Components/Loader";

function WeatherApp() {
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
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const searchLocation = searchTerm.trim();
      const cityData = await getWeatherData(searchLocation);
      if (cityData) {
        setWeather(cityData);
        const forecastData = await getForecastData(
          `${cityData.coord.lat},${cityData.coord.lon}`
        );
        setForecast(forecastData);
      } else {
        const [lat, lon] = searchLocation.split(",").map(Number);
        const weatherData = await getWeatherDataByLatLon(lat, lon);
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

  return (
    <div className="app bg-purple-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-800">
        Weather App
      </h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <WeatherAlert error={error} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {weather && <CurrentWeather weather={weather} />}
          {forecast && <Forecast forecast={forecast} />}
        </>
      )}
    </div>
  );
}

export default WeatherApp;
