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
const getTenFutureCalendarEventsToolDefinition = {
  type: "function",
  function: {
    name: "getCalendarEvents",
    description: "Zwraca najnowsze wydarzenia z kalendarza",
    parameters: { type: "object", properties: {} }
  }
}

const getNFutureCalendarEventsToolDefinition = {
  type: "function",
  function: {
    name: "getNFutureCalendarEvents",
    description: "Zwraca określoną przez użytkownika ilość najbliszych wydarzeń z kalendarza",
    parameters: { type: "object", properties: { numberOfEvents: { type: "integer" } } }
  }
}

const addCalendarEventToolDefinition = {
  type: "function",
  function: {
    name: "addCalendarEvent",
    description: "Dodaje wydarzenie do kalendarza, użytkownik może podać tytuł, godzinę rozpoczęcia, czas trwania w minutach i opis wydarzenia. Czas trwania jest domyślnie ustwaiony na 60 minut, opis jets opcjonalny.",
    parameters: { type: "object", properties: { summary: { type: "string" }, startTime: { type: "string" }, durationInMinutes: { type: "integer" }, description: { type: "string" } } }
  }
}

const getPokemonInfoToolDefinition = {
  type: "function",
  function: {
    name: "getPokemonInfo",
    description: "Informacje o pokemonie podanym przez użytkownika; informacje to nazwa, wysokosc, waga, typy, lista wszytskich umiejętności jakie dany pokemon moż zdobyć oraz jego uniklany numer.",
    parameters: { type: "object", properties: { pokemonName: { type: "string" } } }
  }
}

const hasEvolutionToolDefinition = {
  type: "function",
  function: {
    name: "hasEvolution",
    description: "Sprawdza czy dany pokemon ma ewolucję, lub praewolucję, zwraca cały łańcuch ewolucji",
    parameters: { type: "object", properties: { pokemonName: { type: "string" } } }
  }
}

const searchYoutubeToolDefinition = {
  type: "function",
  function: {
    name: "searchYoutube",
    description: "Wyszukuje film na youtube według query użytkownika. Zwraca tytuł, opis i link do filmu. Podczas przygotowania query upernij się, że jest to dobre zapytanie do szukania",
    parameters: { type: "object", properties: { query: { type: "string" } } }
  }

}

const randNumberToolDefinition = {
  type: "function",
  function: {
    name: "randNumber",
    description: "Generuje losową liczbę z podanego zakresu. Jeśli użytkownik poda zakres np. 1-100 weź 1 jako min i 100 jako max",
    parameters: { type: "object", properties: { min: { type: "integer" }, max: { type: "integer" } } }
  }
}


const openAppToolDefinition = {
  type: "function",
  function: {
    name: "openApp",
    description: "Otwiera w systemie aplikację podaną przez użytkownika",
    parameters: { type: "object", properties: { appName: { type: "string" } } }
  }
}

const sendEmailToolDefinition = {
  type: "function",
  function: {
    name: "sendEmail",
    description: "Wysyła email do podanego odbiorcy z określonym tematem i treścią",
    parameters: { type: "object", properties: { to: { type: "string" } }, subject: { type: "string" }, body: { type: "string" } }
  }
}


export {
  getCurrentWeatherToolDefinition,
  getSilverCoinPriceToolDefinition,
  getSilverPricePredictionToolDefinition,
  getGoldPricePredictionToolDefinition,
  getTenFutureCalendarEventsToolDefinition,
  getNFutureCalendarEventsToolDefinition,
  addCalendarEventToolDefinition,
  getPokemonInfoToolDefinition,
  hasEvolutionToolDefinition,
  searchYoutubeToolDefinition,
  randNumberToolDefinition,
  openAppToolDefinition,
  sendEmailToolDefinition
}