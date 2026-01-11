import { google } from "googleapis";
import { getCalendarClients } from "../auth/auth.js";




//CALENDAR TODO implement mark as resolved task in function
//CALENDAR TODO add event removal


//getFutureCalendarEvents TODO: implement different functions for different user details
// async function getTenFutureCalendarEvents() {
//   try {
//     // 1. Fetch data (it returns a Promise, so we must await)
//     // The structure returned is an OBJECT, not an array.
//     // Keys are UIDs, values are the event objects.
//     const data = await ical.async.fromURL(process.env.ICAL_URL);

//     // 2. Data processing
//     const now = new Date();
//     const activeEvents = Object.values(data) // Convert Object values to Array to iterate
//       .filter(event => {
//         return event.type === 'VEVENT' && // We only want events, not timezone metadata
//           event.start >= now;        // Only future events
//       })
//       .sort((a, b) => a.start - b.start)  // Sort by start date (ascending)
//       .slice(0, 10);                      // Limit to next 10 events to save tokens

//     // 3. Formatting for the AI
//     const formattedEvents = activeEvents.map(event => {
//       return {
//         wydarzenie: event.summary,
//         data: event.start.toLocaleString('pl-PL'), // Format date nicely
//         opis: event.description,
//         lokalizacja: event.location || 'Brak lokalizacji'
//       };
//     });

//     return formattedEvents.length > 0 ? formattedEvents : "Brak nadchodzących wydarzeń.";

//   } catch (error) {
//     return { error: "Błąd podczas pobierania kalendarza: " + error.message };
//   }
// }

async function getNFutureCalendarEvents({ numberOfEvents }){
  try{
    const auth = getCalendarClients();
    const client = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: client})

    const now = new Date().toISOString();
    const response = await calendar.events.list({
      calendarId: 'oskarskoora@gmail.com',
      timeMin: now,
      maxResults: numberOfEvents,
      singleEvents: true,
      orderBy: 'startTime'
    })
    
  const events = response.data.items;
  if(events.length === 0){
    return "Brak nadchodzących wydarzeń.";
  }

  const formattedEvents = events.map(event => {
    return {
      wydarzenie: event.summary,
      data: new Date(event.start.dateTime || event.start.date).toLocaleString('pl-PL'),
      opis: event.description || 'Brak opisu',
      lokalizacja: event.location || 'Brak lokalizacji',
      link: event.htmlLink
    }
  })

  return formattedEvents
  
    
  }catch(error){
    console.error('getNFutureCalendarEvents error:', error.message)
    return {error:"getNFutureCalendarEvents error:" + error.message}
  }

}


async function addCalendarEvent({ summary, startTime, durationInMinutes = 60, description = "" }) {
  try {
    startTime = new Date(startTime);
    const auth = getCalendarClients();
    const client = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: client });

    const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);

    const event = {
      summary: summary,
      start: { dateTime: startTime.toISOString(), timeZone: 'Europe/Warsaw' },
      description: description,
      end: { dateTime: endTime.toISOString(), timeZone: 'Europe/Warsaw' },
    }

    // Debug log to show the exact payload we are sending
    console.log("Sending event to Google:", JSON.stringify(event, null, 2));

    const response = await calendar.events.insert({
      calendarId: 'oskarskoora@gmail.com',
      resource: event
    });

    console.log("Event created! Link:", response.data.htmlLink);
    return {
      success: true,
      message: "Wydarzenie zostało dodane do kalendarza.",
      link: response.data.htmlLink
    };

  } catch (error) {
    console.error("Calendar Error:", error);
    return { error: "Błąd podczas dodawania wydarzenia: " + error.message };
  }
}




export {
  getNFutureCalendarEvents,
  addCalendarEvent,
};
