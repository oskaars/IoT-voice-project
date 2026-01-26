
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
    description: "Aktualna cena skupu Krugerrand 1oz srebra z Tavex.pl, używaj, gdy użytkownik zada jakiekolwiek pytanie o srebro oprócz przewidywania/przyszłości",
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
    description: "Wyszukuje film na youtube według query użytkownika. Domyślnie maxResults jest ustawione na 1 i nie jest wymagane. Zwraca tytuł, opis i link do filmu.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        maxResults: { type: "integer" }
      }
    }
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
    parameters: {
      type: "object",
      properties:
      {
        to: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" }
      }
    }
  }
}

const setTimerToolDefinition = {
  type: "function",
  function: {
    name: "setTimer",
    description: "ustawia timer na określoną liczbę sekund, wraz z treścią powiadomienia, czyli np. ustaw timer na zaparzenie herbaty na 5 minut to message to zaparzenie herbaty, a seconds to 5min* 60s = 300. Jeśli użytkownik poda czas w innej jednostce czasu, zamień ją odpowiednio na sekundy.",
    parameters: {
      type: "object",
      properties: {
        seconds: { type: "integer" },
        message: { type: "string" }
      }
    }
  }
}

const mathOperationsToolDefinition = {
  type: "function",
  function: {
    name: "mathOperations",
    description: "wykonuje operację dodawania, odejmowania, dzielenia, mnożenia oraz modulo na dowolnych dwóch liczbach. Przyjmuje operator oraz dwie liczby ",
    parameters: {
      type: "object",
      properties: {
        operator: { type: 'char' },
        number1: { type: 'integer' },
        number2: { type: 'integer' }
      }
    }
  }

}

const localSpotifyControlsToolDefinition = {
  type: "function",
  function: {
    name: "localSpotifyControls",
    description: "Kontroluje Spotify. Kluczowe akcje:  'play', 'pause', 'next track', 'previous track'.",
    parameters: {
      properties: {
        action: {
          type: "string",
          enum: [
            "name of current track",
            "next track",
            "previous track",
            "play",
            "pause",
            "artist of current track",
            "album of current track",
            "duration of current track",
            "set repeating enabled to true",
            "set repeating enabled to false",
            "shuffling enabled",
            "shuffling disabled"
          ]
        }
      }
    }
  }
}

const localSpotifyGetSongInfoToolDefiniton = {
  type: "function",
  function: {
    name: "localSpotifyGetSongInfo",
    description: "Wyświetla informacje takie jak nazwę artysty oraz nazwę, obecnie granej piosenki na Spotify. (zwraca TYTUŁ i ARTYSTĘ - używaj tego do pytań 'co teraz leci')",
    parameters: { type: "object", properties: {} }
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
  sendEmailToolDefinition,
  setTimerToolDefinition,
  mathOperationsToolDefinition,
  localSpotifyControlsToolDefinition,
  localSpotifyGetSongInfoToolDefiniton
}