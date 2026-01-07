import { google } from "googleapis";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KEY_PATH = path.join(__dirname, '../google_calendar_credentials.json');

//-----------------AUTH-----------------
const getCalendarClients = function () {

    // Using keyFile allows the library to handle file reading and key parsing internally
    // This resolves the 'DECODER routines::unsupported' error caused by manual string handling
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_PATH,
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return auth;
}

export { getCalendarClients };      