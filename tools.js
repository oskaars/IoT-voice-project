import axios from "axios";
import * as cheerio from "cheerio";

async function getSilverCoinPrice() {
  try {
    const { data } = await axios.get("https://tavex.pl/skup-srebra/");
    const $ = cheerio.load(data);
    
    // Szukaj ceny skupu (niższa cena) - typowe selektory Tavex
    const buybackPrice = $(".price, [class*='price']").eq(1).text().trim()  // Druga cena = skup
    
    // DEBUG - pokaż obie ceny
    const allPrices = $(".price, [class*='price']").map((i, el) => $(el).text().trim()).get();
    console.log("Ceny sprzedaży + skupu:", allPrices);
    
    return JSON.stringify({ 
      coin: "Krugerrand 1oz Srebro",
      buyback_price: buybackPrice,
      all_prices: allPrices
    });
    
  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
}

const silverToolDefinition = {
  type: "function",
  function: {
    name: "getSilverCoinPrice",  // Pasuje do availableTools
    description: "Aktualna cena skupu Krugerrand 1oz srebra z Tavex.pl",
    parameters: { type: "object", properties: {} }
  }
};

export { getSilverCoinPrice, silverToolDefinition };
