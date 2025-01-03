import { google } from "googleapis";
import dotenv from "dotenv";
import { serUser } from "../index.js";
import { getPrismaClient } from "../utils/getPrismaInstance.js";
import { processEvents } from "../utils/processEventsSync.js";

const prisma = getPrismaClient();

dotenv.config()

const { OAuth2 } = google.auth;

// {
//     kind: 'calendar#event',
//     etag: '"3350953951900000"',
//     id: '2rvdf2t5ohq6jcuphhfk02of6m',
//     status: 'confirmed',
//     htmlLink: 'https://www.google.com/calendar/event?eid=MnJ2ZGYydDVvaHE2amN1cGhoZmswMm9mNm0gYWEyMDQ5NEBt',
//     created: '2022-02-28T05:10:35.000Z',
//     updated: '2023-02-04T02:16:15.950Z',
//     summary: 'R2 Interview with Ankit - Akhil',
//     description: 'Hi, \n' +
//       '\n' +
//       ' Setting up this meet for R2 Interview for the position CyberSecurity Jr Analyst.\n' +
//       '\n' +
//       'https://internshala.com/employer/application_detail/97511929?referral=employer_chat',
//     creator: { email: 'vcdandothkar@securdi.com' },
//     organizer: { email: 'vcdandothkar@securdi.com' },
//     start: { dateTime: '2022-02-28T06:40:00Z', timeZone: 'Asia/Kolkata' },
//     end: { dateTime: '2022-02-28T06:55:00Z', timeZone: 'Asia/Kolkata' },
//     iCalUID: '2rvdf2t5ohq6jcuphhfk02of6m@google.com',
//     sequence: 0,
//     attendees: [
//       {
//         email: 'aa20494@gmail.com',
//         self: true,
//         responseStatus: 'accepted'
//       }
//     ],
//     hangoutLink: 'https://meet.google.com/jgo-jkwy-weo',
//     conferenceData: {
//       entryPoints: [ [Object], [Object], [Object] ],
//       conferenceSolution: {
//         key: [Object],
//         name: 'Google Meet',
//         iconUri: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png'
//       },
//       conferenceId: 'jgo-jkwy-weo'
//     },
//     guestsCanSeeOtherGuests: false,
//     reminders: { useDefault: true },
//     eventType: 'default'
// }



const oAuth2Client = new OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export const verifyAccessToken = async (token) => {

    const t = await oAuth2Client.getTokenInfo(token)
    return t
}
export const getCalenderEvents = async (token) => {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1)
    try {
        oAuth2Client.setCredentials({
            access_token: token,
            scope: "https://www.googleapis.com/auth/calendar.events"
        })
        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
        const events = await calendar.events.list({
            calendarId: "primary",
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
            timeMin: firstDay
        });
        // if(events.data.items.length){
        //     events.data.items.forEach((ev, i)=>{
        //         console.log(ev)
        //     })
        // }
        return events.data.items
    } catch (error) {
        console.log(error)
    }
}

export const createCalenderEvent = async (data, token) => {
    let { startTime, endTime, title, participants, description } = data;
    participants = participants.map(p => {
        return {
            email: p
        }
    })
    try {
        oAuth2Client.setCredentials({
            access_token: token,
            scope: "https://www.googleapis.com/auth/calendar.events"
        })
        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
        const ev = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
                end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
                summary: title,
                attendees: participants,
                description
            }
        })
        // console.log(ev);
        if (ev.statusText === "OK") {
            return {
                status: true,
                eventId: ev.data.id
            };
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteCalenderEvent = async (eventId, token) => {
    try {
        oAuth2Client.setCredentials({
            access_token: token,
            scope: "https://www.googleapis.com/auth/calendar.events"
        })
        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
        const ev = await calendar.events.delete({
            calendarId: "primary",
            eventId
        })
        return true
    } catch (error) {
        console.log(error)
    }
}

export const updateCalendarEvent = async (eventId, data, token) => {
    let { startTime, endTime, title, participants, description } = data;
    participants = participants.map(p => {
        return {
            email: p
        }
    })
    try {
        oAuth2Client.setCredentials({
            access_token: token,
            scope: "https://www.googleapis.com/auth/calendar.events"
        });
        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
        const ev = await calendar.events.update({
            calendarId: "primary",
            eventId,
            requestBody: {
                start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
                end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
                summary: title,
                attendees: participants,
                description
            }
        });
        if (ev.statusText === "OK") {
            return {
                status: true,
                eventId: ev.data.id
            };
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return { code: error.code, status: false }
    }
}

export const syncWithGCalendar = async (bodyString) => {
    try {
        const arr = bodyString.split("/");
        const email = arr[arr.length - 2];
        const { token, id } = serUser.get(email);

        const evs = await getCalenderEvents(token);
        console.log(evs)
        let newEvents = evs.map((ev) => {
            let participants = ev.attendees?.map(p => {
                return {
                    email:p.email
                }
            })
            return {
                userId: id,
                eventId: ev.id,
                title: ev.summary,
                description: ev.description,
                participants,
                date: new Date(ev.start.dateTime),
                startTime: new Date(ev.start.dateTime),
                endTime: new Date(ev.end.dateTime)
            }
        });
        const prevEv = await prisma.event.findMany({
            where: {
                userId: id
            }
        });

        if (newEvents.length === prevEv.length) {
            for (let i = 0; i < newEvents.length; i++) {
                let e = newEvents[i]
                await prisma.event.update({
                    where: {
                        id: e.id
                    },
                    data: {
                        userId: id,
                        eventId: e.eventId,
                        title: e.title,
                        description: e.description,
                        participants: e.participants,
                        date: e.date,
                        startTimee: e.startTime,
                        endTime: e.endTime
                    }
                });
            }
        } else {
            const { flag, ev } = processEvents(newEvents, prevEv);
            // event is created if flag else deleted
            if (flag) {
                await prisma.event.create({
                    data: {
                        ...ev
                    }
                })
            } else {
                await prisma.event.delete({
                    where: {
                        id: ev.id
                    }
                })
            }
        }
        return {
            status:true,
            msg:"Events synced"
        }
    } catch (error) {
        console.log(error)
        return {
            status:false,
            msg:`Event sync failed with code: ${error.code}`
        }
    }
}