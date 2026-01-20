import axios from "axios"
import dotenv from "dotenv"
import { exec } from "node:child_process";
dotenv.config()

async function searchYoutube({ query, maxResults = 1 }) {
    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                maxResults: maxResults,
                key: process.env.YOUTUBE_API_KEY
            }
        });

        response.data.items.forEach(video => {
            return new Promise((resolve, reject) => {
                const command = `open -u https://www.youtube.com/watch?v=${video.id.videoId}`

                exec(command, (error, stdout, stderr) =>{
                    if(error){
                        console.error(`exec error: ${error}`)
                        return resolve("error opening app" + error.message)
                    }
                    resolve("Success, fully opened " + video.id.videoId)
                    console.log(`child process info: ${stdout}`)
                })
            })

        });


        return response.data.items.map(video => ({
            tytuł: video.snippet.title,
            opis: video.snippet.description,
            link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        }))
    } catch (error) {
        console.error(error.message)
        return { error: error.message }
    }
}


export { searchYoutube }