import axios from "axios";
import * as cheerio from "cheerio";

async function getSilverCoinPrice() {
  try {
    const { data } = await axios.get("https://tavex.pl/srebro/srebrny-krugerrand-1-oz/");
    const $ = cheerio.load(data);

    const buyPrice = $("span.product-poster__table-label.product-poster__table-label--2").eq(1).text().trim();
    return {
      coin: "Krugerrand 1oz Srebro",
      buyback_price: buyPrice || 'nie ma danych na temat cen monet'
    };

  } catch (error) {
    return { error: error.message };
  }
}

// Fetch USD to PLN exchange rate from NBP API
/*
        {
      "table": "A",
      "currency": "dolar amerykański",
      "code": "USD",
      "rates": [
        {
          "no": "001/A/NBP/2025-01-02",
          "effectiveDate": "2025-01-02",
          "mid": 4.05  
        }
      ]
    }
*/
const exchangeRateResponse = await axios.get("https://api.nbp.pl/api/exchangerates/rates/A/USD/");
const exchangeRate = exchangeRateResponse.data.rates[0].mid;

async function getSilverPricePrediction() {
  try {
    // Fetch silver price predictions from CoinCodex
    const response = await axios.get("https://coincodex.com/precious-metal/silver/forecast/")
    const $ = cheerio.load(response.data)

    const oneMonthRaw = $("div.prediction-range ").eq(1).text().trim();
    const threeMonthRaw = $("div.prediction-range").eq(2).text().trim();

    // Extract price after the $ sign using regex (holy vibecoding)
    const oneMonthPrediction = oneMonthRaw.match(/\$\s*([\d.]+)/)?.[1] || null;
    const threeMonthPrediction = threeMonthRaw.match(/\$\s*([\d.]+)/)?.[1] || null;


    // Convert predictions to PLN (if they're numbers)
    const oneMonthInPLN = oneMonthPrediction ? `${(parseFloat(oneMonthPrediction) * exchangeRate).toFixed(2)} PLN` : 'cos nie działa z nbp api';
    const threeMonthInPLN = threeMonthPrediction ? `${(parseFloat(threeMonthPrediction) * exchangeRate).toFixed(2)} PLN` : 'cos nie działa z nbp api';

    return {
      oneMonthPrediction: oneMonthPrediction || "dane na temat przewidywań miesiąc do przodu niedostępne",
      oneMonthPredictionInPLN: oneMonthInPLN || "brak danych",
      threeMonthPrediction: threeMonthPrediction || "dane na temat przewidywań 3 miesiące do przodu niedostępne",
      threeMonthPredictionInPLN: threeMonthInPLN || "brak danych",
      exchangeRate: `1 USD = ${exchangeRate} PLN`
    }

  } catch (error) {
    return { error: error.message };
  }
}
async function getGoldPricePrediction() {
  try {
    const { data } = await axios.get("https://coincodex.com/precious-metal/gold/forecast/")
    const $ = cheerio.load(data)
    const oneMonthRaw = $("div.prediction-range ").eq(1).text().trim();
    const threeMonthRaw = $("div.prediction-range").eq(2).text().trim();

    // Extract price after the $ sign using regex (holy vibecoding)
    const oneMonthPrediction = oneMonthRaw.match(/\$\s*([\d.]+)/)?.[1] || null;
    const threeMonthPrediction = threeMonthRaw.match(/\$\s*([\d.]+)/)?.[1] || null;

    // Convert predictions to PLN (if they're numbers)
    const oneMonthInPLN = oneMonthPrediction ? `${(parseFloat(oneMonthPrediction) * exchangeRate).toFixed(2)} PLN` : 'cos nie działa z nbp api';
    const threeMonthInPLN = threeMonthPrediction ? `${(parseFloat(threeMonthPrediction) * exchangeRate).toFixed(2)} PLN` : 'cos nie działa z nbp api';

    return {
      oneMonthPrediction: oneMonthPrediction || "dane na temat przewidywań miesiąc do przodu niedostępne",
      oneMonthPredictionInPLN: oneMonthInPLN || "brak danych",
      threeMonthPrediction: threeMonthPrediction || "dane na temat przewidywań 3 miesiące do przodu niedostępne",
      threeMonthPredictionInPLN: threeMonthInPLN || "brak danych",
      exchangeRate: `1 USD = ${exchangeRate} PLN`
    }

  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
}

async function getCurrentWeather(city) {
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

const getCurrentWeatherToolDefinition = {
  type: "function",
  function: {
    name: "getCurrentWeather",
    description: "Aktualna pogoda w podanym mieście",
    parameters: { type: "object", properties: { city: { type: "string" } } }
  }
}

const getSilverCoinPriceToolDefinition = {
  type: "function",
  function: {
    name: "getSilverCoinPrice",  // tak samo jak w available tools
    description: "Aktualna cena skupu Krugerrand 1oz srebra z Tavex.pl",
    parameters: { type: "object", properties: {} }
  }
};

const getSilverPricePredictionToolDefinition = {
  type: "function",
  function: {
    name: "getSilverPricePrediction",
    description: "Aktualna predykcja/przewidywanie ceny srebra na miesiąc i na trzy miesiące do przodu",
    parameters: { type: "object", properties: {} }
  }
}

const getGoldPricePredictionToolDefinition = {
  type: "function",
  function: {
    name: "getGoldPricePrediction",
    description: "Aktualna predykcja/przewidywanie ceny złota na miesiąc i na trzy miesiące do przodu",
    parameters: { type: "object", properties: {} }
  }
}

export { getSilverCoinPrice, getSilverCoinPriceToolDefinition, getSilverPricePrediction, getSilverPricePredictionToolDefinition, exchangeRate, getGoldPricePrediction, getGoldPricePredictionToolDefinition, getCurrentWeather, getCurrentWeatherToolDefinition };
