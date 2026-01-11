import axios from "axios";

//     WEATHER
async function getCurrentWeather({ city }) {
  try {
    // 1. Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pl&format=json`;
    const geoResponse = await axios.get(geoUrl);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return { error: `Nie znaleziono miasta: ${city}` };
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // 2. Weather Forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m`;
    const weatherResponse = await axios.get(weatherUrl);
    const current = weatherResponse.data.current;

    return {
      location: {
        name: name,
        country: country,
        latitude: latitude,
        longitude: longitude
      },
      current_weather: {
        temperatura: `${current.temperature_2m} ${weatherResponse.data.current_units.temperature_2m}`,
        temperatura_odczuwalna: `${current.apparent_temperature} ${weatherResponse.data.current_units.apparent_temperature}`,
        predkosc_wiatru: `${current.wind_speed_10m} ${weatherResponse.data.current_units.wind_speed_10m}`,
        opady: `${current.precipitation} ${weatherResponse.data.current_units.precipitation}`,
        zachmurzenie: `${current.cloud_cover} ${weatherResponse.data.current_units.cloud_cover}`,
        godzina: current.time
      }
    };

  } catch (error) {
    return { error: `Błąd pobierania pogody: ${error.message}` };
  }
}

export {
  getCurrentWeather
}
