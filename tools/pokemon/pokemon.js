import axios from "axios"

async function getPokemonInfo({ pokemonName }) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        const data = response.data;

        return {
            nazwa: data.name,
            wysokosc: (data.height / 10) + 'm',
            waga: (data.weight / 10) + 'kg',
            typy: data.types.map(type => type.type.name).join(', '),
            umiejetnosci: data.abilities.map(ability => ability.ability.name).join(', '),
            numer: data.id
        }

    } catch (error) {
        return { error: error.message }
    }
}

//todo: handle edge case, where pokemon has more than one evolution, like eevee, which can evolve into multiple pokemon
async function hasEvolution({ pokemonName }) {
    try {
        // basic pokemon data
        const pokemonRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        
        //species data
        const speciesRes = await axios.get(pokemonRes.data.species.url)

        //evolution chain
        const evoRes = await axios.get(speciesRes.data.evolution_chain.url)

        const chain = []
        let current = evoRes.data.chain

        while(current){
            chain.push(current.species.name)
            current = current.evolves_to[0]
        }

        return {
            pokemon: pokemonName,
            linia_ewolucji: chain.join(' -> '),
            ma_ewolucje: chain.length > 1

        }



    } catch (error) {
        return { error: error.message }
    }
}

export {
    getPokemonInfo,
    hasEvolution
}