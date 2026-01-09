import axios from "axios";
import * as cheerio from "cheerio";
import ical from "node-ical";
import { google } from "googleapis";
import { getCalendarClients } from "./auth.js";
import dotenv from "dotenv";
dotenv.config();


//-----------------TOOLS-----------------

//     PRECIOUS METALS
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


//      CALENDAR
//CALENDAR TODO implement mark as resolved task in function
//CALENDAR TODO add event removal




//info: for now the getCalendarEvents only return specific fixed data -> following week
//getFutureCalendarEvents TODO: implement different functions for different user details
async function getTenFutureCalendarEvents() {
  try {
    // 1. Fetch data (it returns a Promise, so we must await)
    // The structure returned is an OBJECT, not an array.
    // Keys are UIDs, values are the event objects.
    const data = await ical.async.fromURL(process.env.ICAL_URL);

    // 2. Data processing
    const now = new Date();
    const activeEvents = Object.values(data) // Convert Object values to Array to iterate
      .filter(event => {
        return event.type === 'VEVENT' && // We only want events, not timezone metadata
          event.start >= now;        // Only future events
      })
      .sort((a, b) => a.start - b.start)  // Sort by start date (ascending)
      .slice(0, 10);                      // Limit to next 10 events to save tokens

    // 3. Formatting for the AI
    const formattedEvents = activeEvents.map(event => {
      return {
        wydarzenie: event.summary,
        data: event.start.toLocaleString('pl-PL'), // Format date nicely
        opis: event.description,
        lokalizacja: event.location || 'Brak lokalizacji'
      };
    });

    return formattedEvents.length > 0 ? formattedEvents : "Brak nadchodzących wydarzeń.";

  } catch (error) {
    return { error: "Błąd podczas pobierania kalendarza: " + error.message };
  }
}

async function getNFutureCalendarEvents({ numberOfEvents }){
  try{
    const auth = getCalendarClients();
    const client = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: client})

    const now = new Date().toISOString();
    const response = await calendar.events.list({
      calendarId: 'oskarskoora@gmail.com',
      timeMin: now,
      maxResults: numberOfEvents,
      singleEvents: true,
      orderBy: 'startTime'
    })
    
  const events = response.data.items;
  if(events.length === 0){
    return "Brak nadchodzących wydarzeń.";
  }

  const formattedEvents = events.map(event => {
    return {
      wydarzenie: event.summary,
      data: new Date(event.start.dateTime || event.start.date).toLocaleString('pl-PL'),
      opis: event.description || 'Brak opisu',
      lokalizacja: event.location || 'Brak lokalizacji',
      link: event.htmlLink
    }
  })

  return formattedEvents
  
    
  }catch(error){
    console.error('getNFutureCalendarEvents error:', error.message)
    return {error:"getNFutureCalendarEvents error:" + error.message}
  }

}


async function addCalendarEvent({ summary, startTime, durationInMinutes = 60, description = "" }) {
  try {
    startTime = new Date(startTime);
    const auth = getCalendarClients();
    const client = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: client });

    const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);

    const event = {
      summary: summary,
      start: { dateTime: startTime.toISOString(), timeZone: 'Europe/Warsaw' },
      description: description,
      end: { dateTime: endTime.toISOString(), timeZone: 'Europe/Warsaw' },
    }

    // Debug log to show the exact payload we are sending
    console.log("Sending event to Google:", JSON.stringify(event, null, 2));

    const response = await calendar.events.insert({
      calendarId: 'oskarskoora@gmail.com',
      resource: event
    });

    console.log("Event created! Link:", response.data.htmlLink);
    return {
      success: true,
      message: "Wydarzenie zostało dodane do kalendarza.",
      link: response.data.htmlLink
    };

  } catch (error) {
    console.error("Calendar Error:", error);
    return { error: "Błąd podczas dodawania wydarzenia: " + error.message };
  }
}




export {
  getSilverCoinPrice,
  getSilverPricePrediction,
  getGoldPricePrediction,
  getCurrentWeather,
  getTenFutureCalendarEvents,
  getNFutureCalendarEvents,
  addCalendarEvent,
  exchangeRate
};
