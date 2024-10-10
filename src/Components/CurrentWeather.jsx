import React from "react";
import {
  FaTemperatureLow,
  FaTemperatureHigh,
  FaWind,
  FaClock,
} from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { WiSunset } from "react-icons/wi";
import { FiMapPin } from "react-icons/fi";

// Function to convert UNIX timestamp to readable time
const convertUnixToTime = (unixTime, timezoneOffset) => {
  const date = new Date((unixTime + timezoneOffset) * 1000);
  return date.toUTCString().slice(-12, -7);
};

// Function to get local time
const getLocalTime = (timezoneOffset) => {
  const now = new Date();
  const localTime = new Date(now.getTime() + timezoneOffset * 1000);
  return localTime.toUTCString().slice(-12, -7);
};

function CurrentWeather({ weather }) {
  return (
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
        <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
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
            Sunrise: {convertUnixToTime(weather.sys.sunrise, weather.timezone)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WiSunset className="text-orange-600" />
          <p>
            Sunset: {convertUnixToTime(weather.sys.sunset, weather.timezone)}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4">
        <FaClock className="text-purple-600" />
        <p className="ml-2">Local Time: {getLocalTime(weather.timezone)}</p>
      </div>
    </div>
  );
}

export default CurrentWeather;
