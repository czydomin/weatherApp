import React from "react";
import { weatherResponse } from "~/utils/api";

type weatherProps = {
  weather: weatherResponse;
};
export default function WeatherDetails({ weather }: weatherProps) {
  return (
    <div className="">
      <div className="flex gap-2 ml-2">
        <p>Clouds: </p> {weather.clouds.all}
        <p>%</p>
      </div>
      <div className="flex gap-2 ml-2">
        <p>Temperature:</p>
        {weather.main.temp} <p>°C </p>
      </div>
      <div className="flex gap-2 ml-2">
        <p>Feels like:</p>
        {weather.main.feels_like}
        <p>°C</p>
      </div>
      <div className="flex gap-2 ml-2">
        <p>Wind:</p>
        {weather.wind.speed}
        <p>km/h</p>
      </div>
      <div className="flex gap-2 ml-2">
        <p>Humidity:</p>
        {weather.main.humidity}
        <p>%</p>
      </div>
    </div>
  );
}
