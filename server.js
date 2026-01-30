import 'dotenv/config';
import express from "express";
import ollama from "ollama";

//tools
import { getCurrentWeather } from "./tools/other/otherTools.js";
import { getSilverCoinPrice, getSilverPricePrediction, getGoldPricePrediction, exchangeRate } from './tools/metals/metals.js';
import { getNFutureCalendarEvents, addCalendarEvent } from './tools/calendar/calendarOperations.js';
import { getPokemonInfo, hasEvolution } from './tools/pokemon/pokemon.js';
import { searchYoutube } from './tools/youtube/searchYt.js';
import { randNumber } from './tools/local/randNumber.js';
import { openApp } from './tools/local/openApp.js';
import { sendEmail } from './tools/other/sendEmail.js';
import { setTimer } from './tools/local/setTimer.js';
import { mathOperations } from './tools/local/mathOperations.js';
import { localSpotifyControls } from './tools/local/spotify/localSpotifyControls.js';
import { localSpotifyGetSongInfo } from './tools/local/spotify/localSpotifyGetSongInfo.js';
import { catFacts } from './tools/other/catFacts.js';

//definitions
import {
  getSilverCoinPriceToolDefinition,
  getSilverPricePredictionToolDefinition,
  getGoldPricePredictionToolDefinition,
  getCurrentWeatherToolDefinition,
  addCalendarEventToolDefinition,
  getNFutureCalendarEventsToolDefinition,
  getPokemonInfoToolDefinition,
  hasEvolutionToolDefinition,
  searchYoutubeToolDefinition,
  randNumberToolDefinition,
  openAppToolDefinition,
  sendEmailToolDefinition,
  setTimerToolDefinition,
  mathOperationsToolDefinition,
  localSpotifyControlsToolDefinition,
  localSpotifyGetSongInfoToolDefiniton,
  catFactsToolDefinitions
} from "./definitions/definitions.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const availableTools = {
  'getSilverCoinPrice': getSilverCoinPrice,
  'getSilverPricePrediction': getSilverPricePrediction,
  'getGoldPricePrediction': getGoldPricePrediction,
  'getCurrentWeather': getCurrentWeather,
  'getNFutureCalendarEvents': getNFutureCalendarEvents,
  'addCalendarEvent': addCalendarEvent,
  'getPokemonInfo': getPokemonInfo,
  'hasEvolution': hasEvolution,
  'searchYoutube': searchYoutube,
  'randNumber': randNumber,
  'openApp': openApp,
  'sendEmail': sendEmail,
  'setTimer': setTimer,
  'mathOperations': mathOperations,
  'localSpotifyControls': localSpotifyControls,
  'localSpotifyGetSongInfo': localSpotifyGetSongInfo,
  'catFacts': catFacts
};

app.post("/process-audio", async (req, res) => {
  const start = Date.now();
  const userText = req.body.text;
  console.log("Received user text:", userText);

  const messages = [
    {
      role: "system",
      content: `Jesteś inteligentnym asystentem. Twoim celem jest wykonanie zadań użytkownika.
      
ZASADY:
1. Odpowiadaj krótko i konkretnie.
2. Nie tłumacz się, po prostu wykonaj zadanie i podaj wynik.
3.POD ŻADNYM POZOREM NIE DODAWAJ FAKTÓW Z WŁASNEJ WIEDZY. Opieraj się TYLKO na wyniku z narzędzia
4.Twoim jedynym zadaniem jest sformatowanie wyniku narzędzia w zdanie. Tłumacz wynik narzędzia na naturalny język polski.
ZAWSZE używaj dostępnych narzędzi, gdy pytanie dotyczy:
- pogody, cen, kalendarza, pokemonów, YouTube, aplikacji, emaili, timerów, metali szlachetnych, faktów dotyczących kotów, zapytań dotyczących muzyki lub aktualnie lecących piosenek
5. gdy pytanie dotyczy KONTROLOWANIA muzyki np. "puść muzykę", "zatrzymaj muzykę", "shuffluj", "zapętl" -> użyj narzędzia localSpotifyControl
6. gdy pytanie dotyczy INFORMACJI o aktualnie lecącej muzyce, uzyj narzędzia localSpotifyGetSOngInfo
7. gdy pytanie dotyczy "tej" piosenki lub kiedy użytkownik nie poda dokładnie o jaki utwór chodzi, weź aktualnie grającą piosenkę
Jeśli narzędzie zwróci wynik, przekaż go użytkownikowi w prostych słowach.
Dzisiaj jest: ${new Date().toLocaleString('pl-PL')}
`
    },
    { role: "user", content: userText }
  ];

  let response = await ollama.chat({
    model: "llama3.2:3b",
    messages,
    tools: [
      getSilverCoinPriceToolDefinition,
      getSilverPricePredictionToolDefinition,
      getGoldPricePredictionToolDefinition,
      getCurrentWeatherToolDefinition,
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
      localSpotifyGetSongInfoToolDefiniton,
      catFactsToolDefinitions
    ],
    options: { temperature: 0, top_p: 0.9 } //can genaralilly be low bcs this call is just for tool usage detection, tool usage choice is way to long for now
  });

  if (response.message.tool_calls?.length) {
    const toolName = response.message.tool_calls[0].function.name;
    const toolArgs = response.message.tool_calls[0].function.arguments;
    console.log("Tool call:", toolName, "Args:", toolArgs);

    let toolOutput;
    if (Object.keys(toolArgs).length > 0) {
      toolOutput = await availableTools[toolName](toolArgs);
    } else {
      toolOutput = await availableTools[toolName]();
    }
    console.log("Tool result:", toolOutput);

    // append tool result
    const messagesWithToolResult = [
      ...messages,
      response.message,  // assistant's tool call
      {
        role: "tool",
        tool_name: toolName,
        content: JSON.stringify(toolOutput)  // Stringify JSON here only once
      }
    ];

    const finalResponse = await ollama.chat({
      model: "llama3.2:3b", //here the analyzing takes a bit too long imo
      messages: messagesWithToolResult,
    });

    const time = (Date.now() - start) / 1000;

    if (toolName == 'localSpotifyControl') {
      const action = toolArgs.action
      const defaultText = "Wykonano akcję Spotify"
      let text = defaultText

      if (action == 'play') {
        text = "wznawiam odtwarzanie"
      }
      if (action == 'pause') {
        text = "zatrzymano odtwarzanie"
      }
      if (action == 'next track') {
        text = "Leci następny utwór"
      }
      if (action == 'previous track') {
        text = "Puszczam poprzedni utwór"
      }
      console.log("Tempalate used for: ", toolName)

      return res.json({
        text,
        time
      })
    }

    if (toolName == 'localSpotifyGetSongInfo') {
      const song = toolOutput
      const text = `Teraz gra:${song.song_artist} - ${song.song_name}. 
      Z albumu: ${song.song_album}  `
      return res.json({ text, time });

    }
    if (toolName === 'getSilverCoinPrice') {
      const text = `Cena skupu srebrnego Krugerranda (1oz) to: ${toolOutput.buyback_price}.`;
      console.log("Template used for:", toolName);
      return res.json({ text, time, USDtoPLN: exchangeRate });
    }

    if (toolName === 'catFacts') {
      let text = toolOutput.fakt0
      // for (let key in toolOutput) {
      //   text += toolOutput[key]
      // }
      console.log({text: text, time})
      return res.json({text: text, time})
    }

    const cleanedText = finalResponse.message.content
      .replace(/\n/g, ' ')      // Replace newlines with spaces
      .replace(/\s+/g, ' ')     // Collapse multiple spaces into one
      .replace(/\*\*/g, '');    // Remove markdown bold markers

    console.log(cleanedText)
    return res.json(
      {
        text: cleanedText,
        time,
        USDtoPLN: exchangeRate
      }
    );
  }

  // No tool was called - return the model's direct response
  const time = (Date.now() - start) / 1000;
  const cleanedText = response.message.content
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\*\*/g, '');

  console.log("No tool called, direct response:", cleanedText);
  return res.json({
    text: cleanedText || "Nie wiem jak odpowiedzieć na to pytanie.",
    time,
    USDtoPLN: exchangeRate
  });

});


app.listen(PORT, () => console.log(" running on port", PORT));
