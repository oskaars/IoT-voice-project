import axios from "axios";
import * as cheerio from "cheerio";


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


export {
    getSilverCoinPrice,
    getSilverPricePrediction,
    getGoldPricePrediction
}