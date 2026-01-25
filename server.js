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
import { localSpotifyControls } from './tools/local/localSpotifyControls.js';

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
  localSpotifyControlsToolDefinition
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
  'localSpotifyControls': localSpotifyControls
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
2. Jeśli pytanie dotyczy muzyki (np. "co teraz leci", "jaka to piosenka", "tytuł utworu"), UŻYJ narzędzia localSpotifyControls z akcją "name of current track".
3. Nie tłumacz się, po prostu wykonaj zadanie i podaj wynik.
4.POD ŻADNYM POZOREM NIE DODAWAJ FAKTÓW Z WŁASNEJ WIEDZY. Opieraj się TYLKO na wyniku z narzędzia
5.Twoim jedynym zadaniem jest sformatowanie wyniku narzędzia w zdanie. NIE dodawaj NIC innego ani NIE zmieniaj języka wyniku z narzędzia.
ZAWSZE używaj dostępnych narzędzi, gdy pytanie dotyczy:
- pogody, cen, kalendarza, pokemonów, YouTube, aplikacji, emaili, timerów, metali szlachetnych, zapytań dotyczących muzyki lub aktualnie lecących piosenek

Jeśli narzędzie zwróci wynik, przekaż go użytkownikowi w prostych słowach.
Dzisiaj jest: ${new Date().toLocaleString('pl-PL')}
`
    },
    { role: "user", content: userText }
  ];

  let response = await ollama.chat({
    model: "llama3.2:3b", // TODO: download and test qwen3:8b-q4_0 or llama3.2:3b for faster runtime
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
      localSpotifyControlsToolDefinition
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
