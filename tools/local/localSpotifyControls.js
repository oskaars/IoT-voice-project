import { exec } from "node:child_process";

async function localSpotifyControls({ action }) {
    try {
        return new Promise((resolve, reject) => {
            const command = `osascript -e 'tell application "Spotify" to ${action}'`
            exec(command, (error, stdout, stderr) =>{
                if(error){
                    return resolve("Error: " + error.message)
                }
                resolve(stdout.trim() || "Action fully completed!")
            })
        })
    } catch (error) {
        console.error(error.message)
        return error
    }

}

export { localSpotifyControls }