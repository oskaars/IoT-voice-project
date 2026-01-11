import { google } from "googleapis";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); //path to json file with proper path encoding //import.meta.url -> Looks like: "file:///Users/oskar/.../IoT-voice-project/tools/auth.js" // fileURLToPath(import.meta.url) Looks like: "/Users/oskar/.../IoT-voice-project/tools/auth.js"
const __dirname = path.dirname(__filename); // Looks like: "/Users/oskar/.../IoT-voice-project/tools"
const KEY_PATH = path.join(__dirname, '../google_calendar_credentials.json');

//-----------------AUTH-----------------
const getCalendarClients = function () {

    // Using keyFile allows the library to handle file reading and key parsing internally letting google handle key parsing instead of manually importing values from json
    // This resolves the 'DECODER routines::unsupported' error caused by manual string handling
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_PATH,
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return auth;
}

export { getCalendarClients };      