import React, { useState, useEffect } from "react";
// import { AlertCircle, Sun, CloudRain, Wind } from 'lucide-react';

const WeatherComponent = () => {
  const [weather, setWeather] = useState({} as any);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace with your actual OpenWeather API key
  const API_KEY = "57fdbdd6e366add48035b427496db90e";

  const fetchWeather = async (latitude: any, longitude: any) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data could not be fetched");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("Failed to fetch weather information");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve your location");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  //   const getWeatherIcon = (main) => {
  //     switch (main.toLowerCase()) {
  //       case 'clear':
  //         return <Sun className="text-yellow-500 w-16 h-16" />;
  //       case 'clouds':
  //         return <CloudRain className="text-gray-500 w-16 h-16" />;
  //       case 'rain':
  //         return <CloudRain className="text-blue-500 w-16 h-16" />;
  //       default:
  //         return <Wind className="text-gray-400 w-16 h-16" />;
  //     }
  //   };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={getLocation}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Get My Weather
      </button>

      {loading && (
        <div className="text-center mt-4">Loading weather data...</div>
      )}

      {error && (
        <div className="flex items-center text-red-500 mt-4">
          {/* <AlertCircle className="mr-2" /> */}
          {error}
        </div>
      )}

      {weather && weather.main && (
        <div className="mt-6 text-center">
          <div className="flex justify-center mb-4">
            {/* {getWeatherIcon(weather.weather[0].main)} */}
          </div>
          <h3 className="text-xl font-semibold">{weather.name}</h3>
          <p className="text-gray-600">Temperature: {weather.main.temp}°C</p>
          <p className="text-gray-600">
            {weather.weather[0].description.charAt(0).toUpperCase() +
              weather.weather[0].description.slice(1)}
          </p>
          <div className="flex justify-between mt-4">
            <div>
              <p className="font-medium">Humidity</p>
              <p>{weather.main.humidity}%</p>
            </div>
            <div>
              <p className="font-medium">Wind Speed</p>
              <p>{weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
