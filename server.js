import express from "express";
import ollama from "ollama";

import { getSilverCoinPrice, silverToolDefinition } from "./tools.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const availableTools = {
  'getSilverCoinPrice': getSilverCoinPrice,
};

app.post("/process-audio", async (req, res) => {
  const userText = req.body.text;

  console.log("Received user text:", userText);

  // 1.inintial call to ollama
const messages = [
  {
    role: "system", 
    content: "Jesteś pomocnym asystentem po polsku. Odpowiadaj naturalnie i zwięźle."
  },
  { role: "user", content: userText }
];

  const response = await ollama.chat({
    model: "qwen3-vl:8b",
    messages: messages,
    tools: [silverToolDefinition],
  });
  // 2. check if tool call is requested
  if (response.message.tool_calls) {
    console.log("Tool call requested");
    for (const tool of response.message.tool_calls) {
    console.log(`🔧 Tool Requested: ${tool.function.name}`);
      const functionName = tool.function.name;
      console.log("Function Name:", functionName);
      const functionToCall = availableTools[functionName];
      console.log("Function to Call:",  availableTools[functionName]);

      if (functionToCall) {
        const toolOutput = await functionToCall();
        console.log(`📊 Tool Output: ${toolOutput}`);

        // Add the tool result to the conversation history
        messages.push(response.message); // The intent
        messages.push({
          role: "tool",
          content: toolOutput,
        });
      }
    }

    // 3. Final Call: Get the natural language summary
    const finalResponse = await ollama.chat({
      model: "qwen3-vl:30b",
      messages: messages,
      tools: [silverToolDefinition],
    });

    console.log(`Answer: ${finalResponse.message.content}`);
    return res.json({ text: finalResponse.message.content });
  }

  // If no tool was needed (e.g., "Hello")
  res.json({ text: response.message.content });
});

app.listen(PORT, () => console.log(" running on port", PORT));
