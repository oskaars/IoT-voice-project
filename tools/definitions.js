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
const getFutureCalendarEventsToolDefinition = {
  type: "function",
  function: {
    name: "getCalendarEvents",
    description: "Zwraca najnowsze wydarzenia z kalendarza",
    parameters: { type: "object", properties: {} }
  }
}

const addCalendarEventToolDefinition = {
  type: "function",
  function: {
    name: "addCalendarEvent",
    description: "Dodaje wydarzenie do kalendarza, użytkownik może podać tytuł, godzinę rozpoczęcia, czas trwania w minutach i opis wydarzenia. Czas trwania jest domyślnie ustwaiony na 60 minut, opis jets opcjonalny.",
    parameters: { type: "object", properties: {summary: {type: "string"}, startTime: {type: "string"}, durationInMinutes: {type: "integer"}, description: {type: "string"}}}
  }
}


export {
  getCurrentWeatherToolDefinition,
  getSilverCoinPriceToolDefinition,
  getSilverPricePredictionToolDefinition,
  getGoldPricePredictionToolDefinition,
  getFutureCalendarEventsToolDefinition,
  addCalendarEventToolDefinition
}