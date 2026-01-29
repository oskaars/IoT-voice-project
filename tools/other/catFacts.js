import axios from "axios";

async function catFactsGetter({ count = 1 }) {
    try {
        count = parseInt(count)
        const data = await axios.get(`https://meowfacts.herokuapp.com/?count=${count}`)
        console.log(data.data.data)
        const response = {}
        for (let i = 0; i < data.data.data.length; i++) {
            response["fakt" + i] = data.data.data[i]
        }

        return response

    } catch (error) {
        console.error(error.message)
        return error.message
    }
}
async function translate(text) {
    try {
        const response = await fetch('http://localhost:5001/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: 'en', target: 'pl', format: 'text' })
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        return data.translatedText
    } catch (error) {
        console.error("Translate error: ", error.message)
        return text
    }
}

async function catFacts({ count }) {
    const catFacts = await catFactsGetter({ count })
    const translatedFacts = {}

    for (const key in catFacts) {
        translatedFacts[key] = await translate(catFacts[key])
    }

    return translatedFacts
}

export { catFacts }