import { Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
// import { AlertCircle, Sun, CloudRain, Wind } from 'lucide-react';
import { FaCloud, FaSun, FaCloudRain, FaWind } from "react-icons/fa";

const WeatherComponent = () => {
  const [weather, setWeather] = useState({} as any);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace with your actual OpenWeather API key
  const API_KEY = process.env.NEXT_PUBLIC_OPEN_WEATHER_API;

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

  useEffect(() => {
    getLocation();
  }, []);

  const getWeatherIcon = (main: any) => {
    switch (main.toLowerCase()) {
      case "clear":
        return <FaSun className="text-yellow-500 w-12 h-12" />;
      case "clouds":
        return <FaCloud className="text-gray-500 w-12 h-12" />;
      case "rain":
        return <FaCloudRain className="text-blue-500 w-12 h-12" />;
      default:
        return <FaWind className="text-gray-400 w-12 h-12" />;
    }
  };

  return (
    <div>
      {loading && <div className="text-center">Loading weather data...</div>}

      {error && (
        <div className="flex items-center text-red-500">
          {/* <AlertCircle className="mr-2" /> */}
          {error}
        </div>
      )}

      {weather && weather.main && (
        <div className="w-48 mx-auto p-2 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <h3 className="text-base font-semibold">{weather.name}</h3>
            <p className="text-gray-600 text-sm">
              Temperature: {weather.main.temp}°C
            </p>
            <p className="text-gray-600 text-sm">
              {weather.weather[0].description.charAt(0).toUpperCase() +
                weather.weather[0].description.slice(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
