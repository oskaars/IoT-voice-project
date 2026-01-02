import express from "express";
import ollama from "ollama";

//tools
import { getSilverCoinPrice,  getSilverPricePrediction }from "./tools.js";


//definitions
import { getSilverCoinPriceToolDefinition, getSilverPricePredictionToolDefinition } from "./tools.js";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const availableTools = {
  'getSilverCoinPrice': getSilverCoinPrice,
  'getSilverPricePrediction': getSilverPricePrediction
};

app.post("/process-audio", async (req, res) => {
  const start = Date.now();
  const userText = req.body.text;
  console.log("Received user text:", userText);

  const messages = [
    {
      role: "system",
      content: `Jesteś pomocnym asystentem po polsku, gdy masz dane po polsku i po angielsku zawsze wybieraj te po polsku, zawsze gdy masz wybór między polską a inną walutą, wybierz polską. Odpowiadaj naturalnie i zwięźle.
- Analizuj pytanie użytkownika
- Użyj odpowiedniego narzędzia
- Po otrzymaniu wyników z narzędzia, podaj zwięzłą odpowiedź po polsku, która zawiera tylko i wyłącznie odpowiedź na zapytanie użytkownika
- nie halucynuj, bierz zawsze dokładny wynik z narzędzia
- jeśli narzedzie zwraca więcej niż jedną informację, wybierz tylko właściwą, lub tylko właściwe dla zapytania użytkownika
- jeśli w odpowiedzi z narzędzia dostaniesz jakąkolwiek wiadomość o kursie walutowym, zawrzyj ją w odpowiedzi, ale jedynie jako np.: 'kurs: 1USD -> 3.5PLN', odpowiednio dla otrzymanej odpowiedzi. Jeśli nie dostaniesz w odpowiedzi z narzędzia informacji o kurssie walut nie wymyślaj jej, po prostu jej nie podawaj
`
    },
    { role: "user", content: userText }
  ];

  let response = await ollama.chat({ //TODO: disable thinking if endabled 
    model: "qwen3:8b", // TODO: download and test qwen3:8b-q4_0 or llama3.2:3b for faster runtime
    messages,
    tools: [getSilverCoinPriceToolDefinition, getSilverPricePredictionToolDefinition],
    options: { temperature: 0.4, top_p: 0.9 } //can genaralilly be low bcs this call is just for tool usage detection
  });

if (response.message.tool_calls?.length) {
  const toolName = response.message.tool_calls[0].function.name
  console.log("Tool call:", toolName);
  
  const toolOutput = await availableTools[toolName]();
  console.log("Tool result:", toolOutput);
  
  // append tool result
  const messagesWithToolResult = [
    ...messages, 
    response.message,  // assistant's tool call
    {
      role: "tool",
      tool_name: toolName,
      content: JSON.stringify(toolOutput)  // Stringify JSON here
    }
  ];

  const finalResponse = await ollama.chat({
    model: "qwen3:8b",
    messages: messagesWithToolResult,
    stream: false
  });

  const time = (Date.now() - start) / 1000;
  return res.json({ text: finalResponse.message.content, time });
}

});


app.listen(PORT, () => console.log(" running on port", PORT));
