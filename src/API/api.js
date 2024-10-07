const API_KEY = "d72cd891e465bae08c93fa435305316f"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/"; // Corrected base URL

export const getWeatherData = async (query) => {
  try {
    // Check if query is a city name (not lat/lon)
    if (isNaN(query.split(",")[0])) {
      const response = await fetch(
        `${BASE_URL}weather?q=${query}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("City not found");
      return response.json();
    }

    // If query is in lat,lon format, return null to handle in App.js
    return null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Re-throw the error for handling in App.js
  }
};

export const getWeatherDataByLatLon = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("Location not found");
    return response.json();
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    throw error; // Re-throw the error for handling in App.js
  }
};

export const getForecastData = async (latLon) => {
  try {
    const [lat, lon] = latLon.split(",").map(Number);
    const response = await fetch(
      `${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    return response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error; // Re-throw the error for handling in App.js
  }
};
