"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDebounce } from "~/utils/useDebounce";
import SimpleMap from "~/components/TestMap";
import WeatherDetails from "~/components/WeatherDetails";
import {
  City,
  getCityList,
  getWeatherList,
  weatherResponse,
} from "~/utils/api";

export default function Home() {
  const [cityName, setCityName] = useState("wroclaw");
  const [locations, setLocations] = useState<City[] | null>(null);
  const [weather, setWeather] = useState<weatherResponse | null>(null);
  const debouncedCityName = useDebounce(cityName, 500);

  const onSearchCB = useCallback(
    async (city: string) => {
      try {
        const response = await getCityList(city);
        setLocations(response);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("unknown error");
        }
      }
    },
    [setLocations]
  );

  useEffect(() => {
    if (debouncedCityName.length >= 3) {
      onSearchCB(debouncedCityName);
    }
  }, [debouncedCityName, onSearchCB]);

  async function onSearch() {
    try {
      const response = await getCityList(cityName);

      setLocations(response);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("unknown error");
      }
    }
  }

  async function onShow(lat: number, lon: number) {
    try {
      const res = await getWeatherList(lat, lon);
      setWeather(res);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("unknown error");
      }
    }
  }

  return (
    <main className="flex">
      <div>
        <p className="text-2xl py-2 px-2">Weather App</p>
        <div className="flex gap-4 mt-10 mx-2">
          <input
            value={cityName}
            onChange={(event) => {
              setCityName(event.target.value);
            }}
            type="text"
            placeholder="enter city name"
            className="text-black pl-2"
          ></input>
          <button onClick={onSearch} className="border border-1 px-2">
            Search
          </button>
        </div>
      </div>

      {/* <code>{JSON.stringify(locations, null, 2)}</code> */}
      <div className="flex flex-col gap-2 mt-4 px-4">
        {locations?.map((data, index) => {
          return (
            <li
              key={`${data.name}_${index}`}
              onClick={() => onShow(data.lat, data.lon)}
            >
              {data.name} /{data.country}
            </li>
          );
        })}
        {locations?.length === 0 && <p>Results not found</p>}
      </div>
      {weather ? (
        <div className="flex flex-1 gap-2  p-2 h-screen ">
          <WeatherDetails weather={weather} />

          <SimpleMap lat={weather.coord.lat} lng={weather.coord.lon} />
        </div>
      ) : null}
    </main>
  );
}
