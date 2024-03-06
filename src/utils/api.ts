import axios from "axios";

export type City = {
    name: string;
    lat: number;
    lon: number;
    country: string;
  };
  
  export async function getCityList(cityName: string) {
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
  export async function getWeatherList(lat: number, lon: number) {
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
  export type weatherResponse = {
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
  