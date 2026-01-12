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
    parameters: {type: "object", properties: {numberOfEvents: {type: "integer"}}}
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
    parameters: {type: "object", properties: {pokemonName: {type: "string"}}}
  }
}

const hasEvolutionToolDefinition = {
  type: "function",
  function: {
    name: "hasEvolution",
    description: "Sprawdza czy dany pokemon ma ewolucję, lub praewolucję, zwraca cały łańcuch ewolucji",
    parameters: {type: "object", properties: {pokemonName: {type: "string"}}}
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
  hasEvolutionToolDefinition
}