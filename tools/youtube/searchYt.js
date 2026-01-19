import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

async function searchYoutube({ query }) {
    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                maxResults: 3,
                key: process.env.YOUTUBE_API_KEY
            }
        });

        return response.data.items.map(video => ({
            tytuł: video.snippet.title,
            opis: video.snippet.description,
            link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        }))
    } catch (error) {
        console.error(error.message)
        return { error: error.message}
    }
}


export { searchYoutube }