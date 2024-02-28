"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDebounce } from "~/utils/useDebounce";
import SimpleMap from "~/components/TestMap";

export default function Home() {
  const [cityName, setCityName] = useState("");
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
      console.log(response);
      // TODO: add to state only unique cities
      const cityNames = response?.map((city) => {
        return city.name;
      });
      // console.log(cityNames);
      // const test = new Set();
      // test.add("Dominika");
      // test.add("Dominika");
      // test.add("Pola");
      // console.log(test);

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
        <div className="flex flex-col gap-2 border border-1 p-2">
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
          {<SimpleMap lat={weather.coord.lat} lng={weather.coord.lon} />}
        </div>
      ) : null}

      {/* <SimpleMap lat={} lng={} /> */}
    </main>
  );
}

type City = {
  name: string;
  lat: number;
  lon: number;
  country: string;
};

async function getCityList(cityName: string) {
  try {
    const response = await axios<City[]>({
      method: "GET",
      url: `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=01b25e51e5277ae8bfe31818d8e8d059`,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("unknown error");
    }
    return null;
  }
}
async function getWeatherList(lat: number, lon: number) {
  try {
    const res = await axios<weatherResponse>({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=01b25e51e5277ae8bfe31818d8e8d059&units=metric`,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("unknown error");
    }
  }
  return null;
}

type weatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
};
