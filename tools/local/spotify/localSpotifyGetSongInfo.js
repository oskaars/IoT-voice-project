import { exec } from "node:child_process";

async function localSpotifyGetSongName() {
    try {
        return new Promise((resolve, reject) => {
            const command = `osascript -e 'tell application "Spotify" to name of current track'`
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return resolve("getSongName error: " + error.message)
                }
                return resolve(stdout.trim())
            })
        })
    } catch (error) {
        console.error(error.message)
        return error.message
    }
}
async function localSpotifyGetArtist() {
    try {
        return new Promise((resolve, reject) => {
            const command = `osascript -e 'tell application "Spotify" to artist of current track'`
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return resolve("getSpotifyArtist error: " + error.message)
                }
                return resolve(stdout.trim())
            })
        })

    } catch (error) {
        console.error(error.message)
        return error.message
    }
}

async function localSpotifyGetAlbum(){
    try{
        return new Promise((resolve, reject) =>{
            const command = `osascript -e 'tell application "Spotify" to album of current track'`
            exec(command, (error, stdout, stderr) =>{
                if(error){
                    return resolve("local album error: " + error.message)
                }
                return resolve(stdout.trim())
            })
        })
    }catch(error){
        console.error(error.message)
        return error.message
    } 
}

async function localSpotifyGetSongInfo() {
    const songName = await localSpotifyGetSongName()
    const songArtist = await localSpotifyGetArtist()
    const songAlbum = await localSpotifyGetAlbum()
    return {
        song_name: songName,
        song_artist: songArtist,
        song_album: songAlbum
    }
}

export { localSpotifyGetSongInfo }